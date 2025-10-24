import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, Building2, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { helperOrgApi } from "@/services/api";
import { API_ENDPOINTS, DEFAULT_CONFIGS } from "@/config/apiConfig";
import LocationWeather from "@/components/LocationWeather";

const organizationSchema = z.object({
  organizationName: z.string().trim().min(1, "Organization name is required").max(100),
  contactPerson: z.string().trim().min(1, "Contact person name is required").max(100),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().trim().email("Invalid email address").max(255),
  address: z.string().trim().min(1, "Address is required").max(500),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  specialization: z.string().max(500).optional(),
});

const RegisterOrganization = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    capacity: "",
    specialization: "",
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
        setFormData(prev => ({ ...prev, address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
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
      // Validate form data
      const validatedData = organizationSchema.parse({
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      });

      const result = await helperOrgApi.register({
        organizationName: validatedData.organizationName,
        contactPerson: validatedData.contactPerson,
        phone: validatedData.phone,
        email: validatedData.email,
        address: coords ? `${coords.lat},${coords.lon}` : validatedData.address,
        capacity: validatedData.capacity,
        specialization: validatedData.specialization || null,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to register organization");
      }

      toast({
        title: "Success!",
        description: "Your organization has been registered successfully.",
      });

      // Reset form
      setFormData({
        organizationName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        capacity: "",
        specialization: "",
      });

      // Navigate to home after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to register organization. Please try again.",
          variant: "destructive",
        });
        console.error('Error submitting organization:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/90 hover:text-white transition-smooth"
          >
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
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Register Organization</CardTitle>
              <CardDescription>
                Join our network of helper organizations to support those in need
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      placeholder="Enter organization name"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      className={errors.organizationName ? "border-red-500" : ""}
                    />
                    {errors.organizationName && (
                      <p className="text-sm text-red-500">{errors.organizationName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      placeholder="Full name"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      className={errors.contactPerson ? "border-red-500" : ""}
                    />
                    {errors.contactPerson && (
                      <p className="text-sm text-red-500">{errors.contactPerson}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10 digit phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className={errors.phone ? "border-red-500" : ""}
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="organization@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                <div className="flex gap-2 mt-2 items-center">
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
                    Weather: {(weather.weather?.[0]?.description || '').toString()} | Temp: {Math.round(weather.main?.temp)}°{DEFAULT_CONFIGS.weather.units === 'metric' ? 'C' : 'F'}
                  </div>
                )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (optional)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Number of people you can help"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      className={errors.capacity ? "border-red-500" : ""}
                      min="1"
                    />
                    {errors.capacity && (
                      <p className="text-sm text-red-500">{errors.capacity}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization (optional)</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Food distribution, Shelter"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Organization"}
                </Button>
              </form>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t">
                <LocationWeather locationText={formData.address} coords={coords} />
                <div className="grid grid-cols-3 gap-4 text-center mt-6">
                  <div>
                    <div className="flex justify-center mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-medium">45+</div>
                    <div className="text-xs text-muted-foreground">Organizations</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-2">
                      <MapPin className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-sm font-medium">15</div>
                    <div className="text-xs text-muted-foreground">Cities Covered</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-2">
                      <Phone className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-sm font-medium">24/7</div>
                    <div className="text-xs text-muted-foreground">Support Available</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganization;
