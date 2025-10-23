import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, User, Droplet, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { bloodDonorApi } from "@/services/api";

const donorSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  bloodGroup: z.string().trim().min(1, "Blood group is required").max(8),
  age: z.preprocess((v) => Number(v), z.number().int().min(18, "Min age is 18").max(65, "Max age is 65")),
  address: z.string().trim().min(1, "Address is required").max(500),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  lastDonationDate: z.string().optional().or(z.literal("")),
  medicalConditions: z.string().optional(),
});

const RegisterDonor = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    age: "",
    address: "",
    city: "",
    state: "",
    lastDonationDate: "",
    medicalConditions: "",
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
      const validated = donorSchema.parse(formData);

      const result = await bloodDonorApi.register({
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        bloodGroup: validated.bloodGroup,
        age: validated.age,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        lastDonationDate: validated.lastDonationDate || null,
        medicalConditions: validated.medicalConditions || null,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to register donor");
      }

      toast({
        title: "Success!",
        description: "Donor registered successfully.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        bloodGroup: "",
        age: "",
        address: "",
        city: "",
        state: "",
        lastDonationDate: "",
        medicalConditions: "",
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
                  <Droplet className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Register Blood Donor</CardTitle>
              <CardDescription>Join our donor network and help save lives</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" placeholder="Enter full name" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} className={errors.fullName ? "border-red-500" : ""} />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" placeholder="10 digit phone number" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className={errors.phone ? "border-red-500" : ""} maxLength={10} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group *</Label>
                    <Input id="bloodGroup" placeholder="e.g., A+, O-, B+" value={formData.bloodGroup} onChange={(e) => handleInputChange("bloodGroup", e.target.value)} className={errors.bloodGroup ? "border-red-500" : ""} />
                    {errors.bloodGroup && <p className="text-sm text-red-500">{errors.bloodGroup}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input id="age" type="number" placeholder="18 - 65" value={formData.age} onChange={(e) => handleInputChange("age", e.target.value)} className={errors.age ? "border-red-500" : ""} min="18" max="65" />
                    {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastDonationDate">Last Donation Date (optional)</Label>
                    <Input id="lastDonationDate" type="date" value={formData.lastDonationDate} onChange={(e) => handleInputChange("lastDonationDate", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" placeholder="Street address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className={errors.address ? "border-red-500" : ""} />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="City" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} className={errors.city ? "border-red-500" : ""} />
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" placeholder="State" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} className={errors.state ? "border-red-500" : ""} />
                    {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions (optional)</Label>
                  <Textarea id="medicalConditions" placeholder="Any relevant medical conditions" value={formData.medicalConditions} onChange={(e) => handleInputChange("medicalConditions", e.target.value)} rows={3} />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Donor"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex justify-center mb-2">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-medium">Growing</div>
                    <div className="text-xs text-muted-foreground">Donor Community</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-2">
                      <Droplet className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-sm font-medium">Every Type</div>
                    <div className="text-xs text-muted-foreground">Blood Groups</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-2">
                      <Calendar className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-sm font-medium">Quick</div>
                    <div className="text-xs text-muted-foreground">Response Time</div>
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

export default RegisterDonor;
