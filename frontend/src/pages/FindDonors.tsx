import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft, Package, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { z } from "zod";
import { API_URL } from "../config/backend";
import Header from "@/components/Header";

interface Organization {
  id: string;
  organization_name: string;
}

const requestSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  foodType: z.string().min(1, "Requested item is required"),
  quantity: z.string().trim().min(1, "Quantity is required"),
  location: z.string().trim().min(1, "Location is required"),
  availableUntil: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

const FindDonors = () => {
  const [formData, setFormData] = useState({
    organization: "",
    phone: "",
    foodType: "",
    quantity: "",
    location: "",
    description: "",
    availableUntil: ""
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_URL}/organizations`);
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const validatedData = requestSchema.parse(formData);
      const selectedOrg = organizations.find(o => o.id === validatedData.organization);

      const response = await fetch(`${API_URL}/donations/food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          organization: selectedOrg?.organization_name || validatedData.organization,
          organizationId: validatedData.organization,
          contactPerson: user?.name || '',
          phone: validatedData.phone,
          email: user?.email || '',
          foodType: validatedData.foodType,
          quantity: validatedData.quantity,
          location: validatedData.location,
          description: validatedData.description || '',
          availableUntil: validatedData.availableUntil,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit request');
      }

      toast({
        title: "Request Submitted!",
        description: "Your food request has been submitted successfully. All registered users and organizations will be notified.",
      });

      setFormData({
        organization: "",
        phone: "",
        foodType: "",
        quantity: "",
        location: "",
        description: "",
        availableUntil: ""
      });

      setTimeout(() => navigate("/donate"), 2000);
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
          description: (error as Error).message || "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center text-white/90 hover:text-white transition-smooth">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center">
                <Package className="mr-3 h-8 w-8 text-primary" />
                Request Food or Resources
              </CardTitle>
              <CardDescription>
                Submit your request and we'll notify all registered organizations and users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requester">Requester Name</Label>
                  <Input
                    id="requester"
                    value={user?.name || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500">Auto-filled from your account</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10 digit phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10)})}
                    className={errors.phone ? "border-red-500" : ""}
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Select Organization *</Label>
                  <Select value={formData.organization} onValueChange={(value) => setFormData({...formData, organization: value})}>
                    <SelectTrigger className={errors.organization ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choose an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.organization_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foodType">Requested Item / Resource *</Label>
                  <Input
                    id="foodType"
                    value={formData.foodType}
                    onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                    placeholder="e.g., Rice, Vegetables, Blankets"
                    className={errors.foodType ? "border-red-500" : ""}
                  />
                  {errors.foodType && <p className="text-sm text-red-500">{errors.foodType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity / Description *</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="e.g., 50 kg, 100 meals"
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                  {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Your location"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableUntil">Needed By Date *</Label>
                  <Input
                    id="availableUntil"
                    type="date"
                    min={minDate}
                    value={formData.availableUntil}
                    onChange={(e) => setFormData({...formData, availableUntil: e.target.value})}
                    className={errors.availableUntil ? "border-red-500" : ""}
                  />
                  {errors.availableUntil && <p className="text-sm text-red-500">{errors.availableUntil}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Any additional information..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FindDonors;
