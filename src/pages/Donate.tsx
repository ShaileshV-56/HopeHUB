import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft, Package, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { foodDonationApi } from "@/services/api";

const donationSchema = z.object({
  organization: z.string().trim().min(1, "Organization name is required").max(100),
  contactPerson: z.string().trim().min(1, "Contact person name is required").max(100),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
  foodType: z.string().min(1, "Food type is required"),
  quantity: z.string().trim().min(1, "Quantity is required").max(100),
  location: z.string().trim().min(1, "Location is required").max(500),
  availableUntil: z.string().min(1, "Available until date is required"),
  description: z.string().max(1000).optional(),
});

const Donate = () => {
  const [formData, setFormData] = useState({
    organization: "",
    contactPerson: "",
    phone: "",
    email: "",
    foodType: "",
    quantity: "",
    location: "",
    description: "",
    availableUntil: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const validatedData = donationSchema.parse(formData);

      const result = await foodDonationApi.submit({
        organization: validatedData.organization,
        contactPerson: validatedData.contactPerson,
        phone: validatedData.phone,
        foodType: validatedData.foodType,
        quantity: validatedData.quantity,
        location: validatedData.location,
        description: validatedData.description || null,
        availableUntil: validatedData.availableUntil,
        email: validatedData.email || null,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit donation");
      }

      toast({
        title: "Success!",
        description: "Your food donation has been registered successfully.",
      });

      // Reset form
      setFormData({
        organization: "",
        contactPerson: "",
        phone: "",
        email: "",
        foodType: "",
        quantity: "",
        location: "",
        description: "",
        availableUntil: ""
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
          description: "Failed to register donation. Please try again.",
          variant: "destructive",
        });
        console.error('Error submitting donation:', error);
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
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Donate Food</CardTitle>
              <CardDescription>
                Help reduce food waste and feed those in need by registering your food donation
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization/Restaurant Name *</Label>
                    <Input
                      id="organization"
                      placeholder="Enter your organization name"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      className={errors.organization ? "border-red-500" : ""}
                    />
                    {errors.organization && (
                      <p className="text-sm text-red-500">{errors.organization}</p>
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
                    <Label htmlFor="foodType">Food Type *</Label>
                    <Select 
                      onValueChange={(value) => handleInputChange("foodType", value)}
                      value={formData.foodType}
                    >
                      <SelectTrigger className={errors.foodType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select food type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prepared-meals">Prepared Meals</SelectItem>
                        <SelectItem value="fresh-produce">Fresh Produce</SelectItem>
                        <SelectItem value="bakery-items">Bakery Items</SelectItem>
                        <SelectItem value="dairy-products">Dairy Products</SelectItem>
                        <SelectItem value="canned-goods">Canned Goods</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.foodType && (
                      <p className="text-sm text-red-500">{errors.foodType}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity/Servings *</Label>
                    <Input
                      id="quantity"
                      placeholder="e.g., 50 servings, 10kg"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-red-500">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Pickup Location *</Label>
                    <Input
                      id="location"
                      placeholder="Address or area"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availableUntil">Available Until *</Label>
                    <Input
                      id="availableUntil"
                      type="datetime-local"
                      value={formData.availableUntil}
                      onChange={(e) => handleInputChange("availableUntil", e.target.value)}
                      className={errors.availableUntil ? "border-red-500" : ""}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {errors.availableUntil && (
                      <p className="text-sm text-red-500">{errors.availableUntil}</p>
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
                    <Label htmlFor="email">Contact Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
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
                  <Label htmlFor="description">Additional Details (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Any special instructions or additional information about the food donation"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                    rows={3}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Food Donation"}
                </Button>
              </form>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex justify-center mb-2">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-medium">180</div>
                    <div className="text-xs text-muted-foreground">Meals Saved Today</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-2">
                      <MapPin className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-sm font-medium">24</div>
                    <div className="text-xs text-muted-foreground">Active Locations</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-2">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-sm font-medium">2.5 hrs</div>
                    <div className="text-xs text-muted-foreground">Avg Response Time</div>
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

export default Donate;