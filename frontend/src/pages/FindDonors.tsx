import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Phone, Mail, User, Calendar, Droplet, Filter } from "lucide-react";
import { bloodDonorApi } from "@/services/api";

interface Donor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  blood_group: string;
  age: number;
  address: string;
  city: string;
  state: string;
  available: boolean;
  last_donation_date: string | null;
  medical_conditions: string | null;
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
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      setError(null);
      const res = await bloodDonorApi.getAll();
      if (!res.success) {
        setError(res.error || "Failed to load donors");
        setLoading(false);
        return;
      }
      setDonors((res.data || []) as Donor[]);
      setLoading(false);
    };
    fetchDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    const q = query.toLowerCase();
    return donors.filter((d) => {
      const matchesQuery =
        d.full_name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.blood_group.toLowerCase().includes(q);
      const matchesGroup = bloodGroup ? d.blood_group.toLowerCase() === bloodGroup.toLowerCase() : true;
      const matchesAvailable = availableOnly ? d.available === true : true;
      return matchesQuery && matchesGroup && matchesAvailable;
    });
  }, [donors, query, bloodGroup, availableOnly]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Blood Donors</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">Search registered blood donors by location, blood group, and availability.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input placeholder="Search by name, city, state, or address..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <Input placeholder="Blood group (e.g., A+, O-)" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="md:w-48" />
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
              {filteredDonors.map((donor) => (
                <Card key={donor.id} className="bg-white/95 backdrop-blur-sm shadow-large hover:shadow-green transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{donor.full_name}</h3>
                          <Badge variant="secondary"><Droplet className="h-3 w-3 mr-1" /> {donor.blood_group}</Badge>
                          {donor.available && (
                            <Badge className="bg-success text-white">Available</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{donor.city}, {donor.state}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Last donation: {formatDate(donor.last_donation_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Age: {donor.age}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${donor.phone}`} className="hover:underline">{donor.phone}</a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${donor.email}`} className="hover:underline">{donor.email}</a>
                          </div>
                        </div>

                        {donor.medical_conditions && (
                          <div className="mt-4 text-sm">
                            <span className="font-medium">Medical Conditions:</span>
                            <p className="text-muted-foreground mt-1">{donor.medical_conditions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredDonors.length === 0 && (
                <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
                  <div className="text-muted-foreground">No donors found. Try adjusting your search.</div>
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
