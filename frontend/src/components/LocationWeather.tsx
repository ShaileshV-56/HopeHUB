import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { API_ENDPOINTS, DEFAULT_CONFIGS } from '@/config/apiConfig';

interface Props {
  locationText?: string | null; // freeform address or "lat, lon"
  coords?: { lat: number; lon: number } | null;
  showMap?: boolean;
  className?: string;
}

interface GeocodeResult {
  lat: number;
  lon: number;
  placeName?: string;
}

const parseLatLon = (text?: string | null): { lat: number; lon: number } | null => {
  if (!text) return null;
  const m = text.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lon = parseFloat(m[2]);
  if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
  return null;
};

export default function LocationWeather({ locationText, coords, showMap = true, className }: Props) {
  const [geo, setGeo] = useState<GeocodeResult | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [fallbackWeather, setFallbackWeather] = useState<any>(null);
  const hasOWMKey = !!API_ENDPOINTS.weather.openWeatherMap.publicKey;

  const effectiveCoords = useMemo(() => {
    return coords || parseLatLon(locationText || undefined) || null;
  }, [coords, locationText]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (!effectiveCoords && locationText) {
          // Geocode free text using Mapbox forward geocoding
          const accessToken = API_ENDPOINTS.maps.mapbox.publicKey;
          if (!accessToken) return;
          const url = `${API_ENDPOINTS.maps.mapbox.endpoint}/geocoding/v5/mapbox.places/${encodeURIComponent(
            locationText
          )}.json?limit=1&access_token=${accessToken}`;
          const res = await fetch(url);
          const data = await res.json();
          const f = data?.features?.[0];
          if (!cancelled && f?.center) {
            setGeo({ lat: f.center[1], lon: f.center[0], placeName: f.place_name });
          }
        } else if (effectiveCoords) {
          setGeo({ lat: effectiveCoords.lat, lon: effectiveCoords.lon, placeName: locationText || undefined });
        }
      } catch {}
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [effectiveCoords, locationText]);

  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async () => {
      const c = effectiveCoords || geo;
      if (!c) return;
      try {
        if (hasOWMKey) {
          const url = `${API_ENDPOINTS.weather.openWeatherMap.endpoint}/weather?lat=${c.lat}&lon=${c.lon}&appid=${API_ENDPOINTS.weather.openWeatherMap.publicKey}&units=${DEFAULT_CONFIGS.weather.units}`;
          const res = await fetch(url);
          const data = await res.json();
          if (!cancelled) setWeather(data);
        } else {
          // Fallback: Open-Meteo (no API key required)
          const unitParam = DEFAULT_CONFIGS.weather.units === 'metric' ? 'celsius' : 'fahrenheit';
          const windUnit = DEFAULT_CONFIGS.weather.units === 'metric' ? 'kmh' : 'mph';
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true&temperature_unit=${unitParam}&windspeed_unit=${windUnit}`;
          const res = await fetch(url);
          const data = await res.json();
          if (!cancelled) setFallbackWeather(data?.current_weather || null);
        }
      } catch {}
    };
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [effectiveCoords, geo, hasOWMKey]);

  const mapSrc = useMemo(() => {
    const c = effectiveCoords || geo;
    if (!c) return '';
    const token = API_ENDPOINTS.maps.mapbox.publicKey;
    if (!token) return '';
    // Mapbox Static Images API
    // style: streets-v11, marker at coords
    const base = `${API_ENDPOINTS.maps.mapbox.endpoint}/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${c.lon},${c.lat})/${c.lon},${c.lat},13,0/600x300@2x`;
    return `${base}?access_token=${token}`;
  }, [effectiveCoords, geo]);

  if (!effectiveCoords && !geo && !locationText) return null;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {showMap && mapSrc && (
          <img src={mapSrc} alt="Location map" className="w-full rounded-md mb-3" />
        )}
        <div className="text-sm text-muted-foreground">
          {geo && (
            <div className="mb-2">
              <span className="font-medium text-foreground">Location:</span>{' '}
              {geo.placeName || `${geo.lat.toFixed(4)}, ${geo.lon.toFixed(4)}`}
            </div>
          )}
          {weather && (
            <div>
              <span className="font-medium text-foreground">Weather:</span>{' '}
              {(weather.weather?.[0]?.description || '').toString()} | Temp: {Math.round(weather.main?.temp)}°
              {DEFAULT_CONFIGS.weather.units === 'metric' ? 'C' : 'F'} | Humidity: {weather.main?.humidity}%
            </div>
          )}
          {!weather && fallbackWeather && (
            <div>
              <span className="font-medium text-foreground">Weather:</span>{' '}
              Wind {Math.round(fallbackWeather.windspeed)} {DEFAULT_CONFIGS.weather.units === 'metric' ? 'km/h' : 'mph'} | Temp: {Math.round(fallbackWeather.temperature)}°
              {DEFAULT_CONFIGS.weather.units === 'metric' ? 'C' : 'F'}
            </div>
          )}
          {!weather && !fallbackWeather && (effectiveCoords || geo) && (
            <div className="text-xs">Loading weather…</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
