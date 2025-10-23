import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using OpenWeatherMap free API (you can get API key from openweathermap.org)
        // For demo, using mock data
        const mockWeatherData: WeatherData = {
          temperature: 32,
          description: "Hot and Humid",
          location: "Vellore, Tamil Nadu",
          humidity: 78,
          windSpeed: 8,
          icon: "sunny"
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeather(mockWeatherData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sunny":
        return <Sun className="h-8 w-8 text-warning" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-info" />;
      case "snowy":
        return <Snowflake className="h-8 w-8 text-blue-200" />;
      default:
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {getWeatherIcon(weather.icon)}
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{weather.temperature}°C</span>
            <span className="text-sm text-muted-foreground">{weather.description}</span>
          </div>
          <p className="text-xs text-muted-foreground">{weather.location}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              {weather.windSpeed} km/h
            </div>
            <div>Humidity: {weather.humidity}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;