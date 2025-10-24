import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, Package, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { foodDonationApi } from "@/services/api";
import { API_ENDPOINTS, DEFAULT_CONFIGS } from "@/config/apiConfig";
import LocationWeather from "@/components/LocationWeather";

const donationSchema = z.object({
  organization: z.string().trim().min(1, "Organization/Restaurant name is required").max(100),
  contactPerson: z.string().trim().min(1, "Contact person is required").max(100),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
  foodType: z.string().min(1, "Food type is required"),
  quantity: z.string().trim().min(1, "Quantity is required").max(100),
  location: z.string().trim().min(1, "Pickup location is required").max(500),
  availableUntil: z.string().min(1, "Available until is required"),
  description: z.string().max(1000).optional(),
});

const RegisterDonor = () => {
  const [formData, setFormData] = useState({
    organization: "",
    contactPerson: "",
    phone: "",
    email: "",
    foodType: "",
    quantity: "",
    location: "",
    availableUntil: "",
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
        // Best-effort reverse geocode via browser Geolocation; user may still edit address
        handleInputChange("location", `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
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
      const validated = donationSchema.parse(formData);

      const result = await foodDonationApi.submit({
        organization: validated.organization,
        contactPerson: validated.contactPerson,
        phone: validated.phone,
        email: validated.email || null,
        foodType: validated.foodType,
        quantity: validated.quantity,
        location: coords ? `${coords.lat},${coords.lon}` : validated.location,
        description: validated.description || null,
        availableUntil: validated.availableUntil,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to register donor");
      }

      toast({
        title: "Success!",
        description: "Food donation registered successfully.",
      });

      setFormData({
        organization: "",
        contactPerson: "",
        phone: "",
        email: "",
        foodType: "",
        quantity: "",
        location: "",
        availableUntil: "",
        description: "",
      });

      setTimeout(() => navigate("/find-donors"), 1200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        toast({ title: "Validation Error", description: "Please check the form.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Registration failed. Try again.", variant: "destructive" });
        console.error("Error registering donor:", error);
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
              <CardTitle className="text-2xl">Register Food Donation</CardTitle>
              <CardDescription>Share surplus food with those in need</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization/Restaurant Name *</Label>
                    <Input id="organization" placeholder="Enter your organization name" value={formData.organization} onChange={(e) => handleInputChange("organization", e.target.value)} className={errors.organization ? "border-red-500" : ""} />
                    {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input id="contactPerson" placeholder="Full name" value={formData.contactPerson} onChange={(e) => handleInputChange("contactPerson", e.target.value)} className={errors.contactPerson ? "border-red-500" : ""} />
                    {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone *</Label>
                    <Input id="phone" type="tel" placeholder="10 digit phone number" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className={errors.phone ? "border-red-500" : ""} maxLength={10} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email (optional)</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foodType">Food Type *</Label>
                    <Input id="foodType" placeholder="e.g., Prepared meals, Fresh produce" value={formData.foodType} onChange={(e) => handleInputChange("foodType", e.target.value)} className={errors.foodType ? "border-red-500" : ""} />
                    {errors.foodType && <p className="text-sm text-red-500">{errors.foodType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity/Servings *</Label>
                    <Input id="quantity" placeholder="e.g., 50 servings, 10kg" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)} className={errors.quantity ? "border-red-500" : ""} />
                    {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Pickup Location *</Label>
                    <Input id="location" placeholder="Address or area" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} className={errors.location ? "border-red-500" : ""} />
                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                <div className="flex gap-2 items-center">
                  <Button type="button" variant="outline" onClick={handleUseMyLocation}>Use My Location</Button>
                  {coords && (
                    <a
                      className="text-sm underline text-primary self-center"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps?q=${coords.lat},${coords.lon}`}
                    >
                      View on Map
                    </a>
                  )}
                  {coords && (
                    <span className="text-xs text-muted-foreground">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</span>
                  )}
                </div>
                {coords && (
                  <div className="mt-2">
                    <img
                      className="w-full h-48 object-cover rounded"
                      alt="Map preview"
                      src={`${API_ENDPOINTS.maps.mapbox.endpoint}/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${coords.lon},${coords.lat})/${coords.lon},${coords.lat},13,0/600x300@2x?access_token=${API_ENDPOINTS.maps.mapbox.publicKey}`}
                    />
                  </div>
                )}
                {weather && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Weather: {(weather.weather?.[0]?.description || '').toString()} | Temp: {Math.round(weather.main?.temp)}°{DEFAULT_CONFIGS.weather.units === 'metric' ? 'C' : 'F'} | Humidity: {weather.main?.humidity}%
                  </div>
                )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableUntil">Available Until *</Label>
                    <Input id="availableUntil" type="datetime-local" value={formData.availableUntil} onChange={(e) => handleInputChange("availableUntil", e.target.value)} className={errors.availableUntil ? "border-red-500" : ""} min={new Date().toISOString().slice(0, 16)} />
                    {errors.availableUntil && <p className="text-sm text-red-500">{errors.availableUntil}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (optional)</Label>
                  <Textarea id="description" placeholder="Any special instructions or additional information" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Donor"}
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

export default RegisterDonor;
