import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, MapPin, Phone, Mail, Package, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { foodRequestApi } from "@/services/api";
import { API_ENDPOINTS, DEFAULT_CONFIGS } from "@/config/apiConfig";
import LocationWeather from "@/components/LocationWeather";

const requestSchema = z.object({
  requesterName: z.string().trim().min(1, "Your name is required").max(100),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
  organization: z.string().max(100).optional().or(z.literal("")),
  requestedItem: z.string().trim().min(1, "What do you need?").max(200),
  quantity: z.string().trim().min(1, "Quantity is required").max(100),
  location: z.string().trim().min(1, "Your address/location is required").max(500),
  neededBy: z.string().min(1, "When do you need it by?"),
  description: z.string().max(1000).optional(),
});

const RequestResources = () => {
  const [formData, setFormData] = useState({
    requesterName: "",
    phone: "",
    email: "",
    organization: "",
    requestedItem: "",
    quantity: "",
    location: "",
    neededBy: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const fetchWeather = async (lat: number, lon: number) => {
    const key = API_ENDPOINTS.weather.openWeatherMap.publicKey;
    if (!key) return;
    try {
      const url = `${API_ENDPOINTS.weather.openWeatherMap.endpoint}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${DEFAULT_CONFIGS.weather.units}`;
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
    } catch {}
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        setFormData(prev => ({ ...prev, location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        fetchWeather(latitude, longitude);
      },
      () => {}
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = requestSchema.parse(formData);
      const payload = {
        requesterName: validated.requesterName,
        phone: validated.phone,
        email: validated.email || null,
        organization: validated.organization || null,
        requestedItem: validated.requestedItem,
        quantity: validated.quantity,
        location: coords ? `${coords.lat},${coords.lon}` : validated.location,
        description: validated.description || null,
        neededBy: validated.neededBy,
      };

      const result = await foodRequestApi.create(payload);
      if (!result.success) throw new Error(result.error || "Failed to submit request");

      toast({ title: "Request submitted", description: "We'll notify helpers near you." });

      setFormData({
        requesterName: "",
        phone: "",
        email: "",
        organization: "",
        requestedItem: "",
        quantity: "",
        location: "",
        neededBy: "",
        description: "",
      });

      setTimeout(() => navigate("/donate"), 1200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        toast({ title: "Validation Error", description: "Please check the form.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to submit. Try again.", variant: "destructive" });
        console.error("Error submitting request:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center text-white/90 hover:text-white transition-smooth">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-white" />
            <span className="text-white font-semibold">HopeHUB</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Request Resources</CardTitle>
              <CardDescription>Tell us what you need. Organization is optional.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requesterName">Your Name *</Label>
                    <Input id="requesterName" placeholder="Full name" value={formData.requesterName} onChange={(e) => handleInputChange("requesterName", e.target.value)} className={errors.requesterName ? "border-red-500" : ""} />
                    {errors.requesterName && <p className="text-sm text-red-500">{errors.requesterName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" placeholder="10 digit phone number" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className={errors.phone ? "border-red-500" : ""} maxLength={10} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization (optional)</Label>
                    <Input id="organization" placeholder="If you represent one" value={formData.organization} onChange={(e) => handleInputChange("organization", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestedItem">What do you need? *</Label>
                    <Input id="requestedItem" placeholder="e.g., Cooked meals, Groceries" value={formData.requestedItem} onChange={(e) => handleInputChange("requestedItem", e.target.value)} className={errors.requestedItem ? "border-red-500" : ""} />
                    {errors.requestedItem && <p className="text-sm text-red-500">{errors.requestedItem}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" placeholder="e.g., 20 meals, 5kg rice" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)} className={errors.quantity ? "border-red-500" : ""} />
                    {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Your Address/Location *</Label>
                    <Input id="location" placeholder="Address or area" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} className={errors.location ? "border-red-500" : ""} />
                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                    <div className="flex gap-2 items-center mt-2">
                      <Button type="button" variant="outline" onClick={handleUseMyLocation}>Use My Location</Button>
                      {coords && (
                        <a className="text-sm underline text-primary" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${coords.lat},${coords.lon}`}>
                          View on Map
                        </a>
                      )}
                      {coords && <span className="text-xs text-muted-foreground">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</span>}
                    </div>
                    {coords && (
                      <div className="mt-2">
                        <img className="w-full h-48 object-cover rounded" alt="Map preview" src={`${API_ENDPOINTS.maps.mapbox.endpoint}/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${coords.lon},${coords.lat})/${coords.lon},${coords.lat},13,0/600x300@2x?access_token=${API_ENDPOINTS.maps.mapbox.publicKey}`} />
                      </div>
                    )}
                    {weather && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Weather: {(weather.weather?.[0]?.description || '').toString()} | Temp: {Math.round(weather.main?.temp)}?{DEFAULT_CONFIGS.weather.units === 'metric' ? 'C' : 'F'} | Humidity: {weather.main?.humidity}%
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neededBy">Needed By *</Label>
                    <Input id="neededBy" type="datetime-local" value={formData.neededBy} onChange={(e) => handleInputChange("neededBy", e.target.value)} className={errors.neededBy ? "border-red-500" : ""} min={new Date().toISOString().slice(0, 16)} />
                    {errors.neededBy && <p className="text-sm text-red-500">{errors.neededBy}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (optional)</Label>
                  <Textarea id="description" placeholder="Any special instructions or additional information" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t">
                <LocationWeather locationText={formData.location} coords={coords} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestResources;
