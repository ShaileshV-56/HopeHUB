import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Phone, Mail, Calendar, Filter, Package } from "lucide-react";
import { foodDonationApi } from "@/services/api";

interface FoodDonation {
  id: string;
  organization: string;
  contact_person: string;
  phone: string;
  email: string | null;
  food_type: string;
  quantity: string;
  location: string;
  description: string | null;
  available_until: string;
  status: string;
  created_at: string;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};

const FindDonors = () => {
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);
      const res = await foodDonationApi.getAll();
      if (!res.success) {
        setError(res.error || "Failed to load food donations");
        setLoading(false);
        return;
      }
      setDonations((res.data || []) as FoodDonation[]);
      setLoading(false);
    };
    fetchDonations();
  }, []);

  const filteredDonations = useMemo(() => {
    const q = query.toLowerCase();
    return donations.filter((d) => {
      const matchesQuery =
        d.organization.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.food_type.toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q);
      const matchesAvailable = availableOnly ? d.status === 'available' : true;
      return matchesQuery && matchesAvailable;
    });
  }, [donations, query, availableOnly]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center text-white/90 hover:text-white transition-smooth">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Link to="/" className="inline-block">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-white" />
              <span className="text-white font-semibold">HopeHUB</span>
            </div>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Food Donations</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">Search available food donations by location, type, and availability.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input placeholder="Search by org, location, type..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <Button variant={availableOnly ? "default" : "outline"} onClick={() => setAvailableOnly((v) => !v)} className="md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  {availableOnly ? "Showing Available" : "Available Only"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading && (
            <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
              <div className="text-muted-foreground">Loading donors...</div>
            </Card>
          )}
          {error && (
            <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
              <div className="text-red-600">{error}</div>
            </Card>
          )}

          {!loading && !error && (
            <div className="grid gap-6">
              {filteredDonations.map((item) => (
                <Card key={item.id} className="bg-white/95 backdrop-blur-sm shadow-large hover:shadow-green transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{item.organization}</h3>
                          <Badge variant="secondary">{item.food_type}</Badge>
                          {item.status === 'available' && (
                            <Badge className="bg-success text-white">Available</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Available until: {formatDate(item.available_until)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${item.phone}`} className="hover:underline">{item.phone}</a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {item.email && <a href={`mailto:${item.email}`} className="hover:underline">{item.email}</a>}
                          </div>
                        </div>

                        {item.description && (
                          <div className="mt-4 text-sm">
                            <span className="font-medium">Details:</span>
                            <p className="text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredDonations.length === 0 && (
                <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
                  <div className="text-muted-foreground">No food donations found. Try adjusting your search.</div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDonors;
