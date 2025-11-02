import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { helperOrgApi, authApi } from "@/services/api";
import LocationWeather from "@/components/LocationWeather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Building2, MapPin, Phone, Mail, Users } from "lucide-react";

interface Organization {
  id: string;
  organization_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  capacity: number | null;
  specialization: string | null;
  status: string;
  created_at: string;
  user_id?: string | null;
}

const Organizations = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const [me, res] = await Promise.all([
        authApi.getCurrentUser().catch(() => ({ success: false } as any)),
        helperOrgApi.getAll(),
      ]);
      if (me.success && (me.data as any)?.id) {
        setCurrentUserId((me.data as any).id);
      } else {
        setCurrentUserId(null);
      }
      if (!res.success) {
        setError(res.error || "Failed to load organizations");
        setLoading(false);
        return;
      }
      setOrgs(res.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm('Are you sure you want to delete this organization?');
    if (!ok) return;
    const res = await helperOrgApi.remove(id);
    if (!res.success) {
      alert(res.error || 'Failed to delete');
      return;
    }
    setOrgs(prev => prev.filter(o => o.id !== id));
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return orgs.filter((o) =>
      o.organization_name.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      (o.specialization || "").toLowerCase().includes(q)
    );
  }, [orgs, query]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Registered Organizations</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">Explore organizations registered on HopeHUB</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="Search by name, address, or specialization..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <Link to="/register-organization">
                  <Button variant="outline">Register Organization</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading && (
            <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
              <div className="text-muted-foreground">Loading organizations...</div>
            </Card>
          )}
          {error && (
            <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
              <div className="text-red-600">{error}</div>
            </Card>
          )}

          {!loading && !error && (
            <div className="grid gap-6">
              {filtered.map((org) => (
                <Card key={org.id} className="bg-white/95 backdrop-blur-sm shadow-large">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{org.organization_name}</h3>
                          <Badge variant="secondary">{org.status}</Badge>
                          {org.capacity != null && (
                            <Badge className="bg-success text-white">Capacity: {org.capacity}</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{org.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{org.specialization || "General Support"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{org.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${org.phone}`} className="hover:underline">{org.phone}</a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${org.email}`} className="hover:underline">{org.email}</a>
                          </div>
                        </div>
                        <div className="mt-4">
                          <LocationWeather locationText={org.address} showMap />
                        </div>
                      </div>
                      {currentUserId && org.user_id === currentUserId && (
                        <div className="flex-shrink-0">
                          <Button variant="destructive" onClick={() => handleDelete(org.id)}>Delete</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filtered.length === 0 && (
                <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
                  <div className="text-muted-foreground">No organizations found.</div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organizations;
