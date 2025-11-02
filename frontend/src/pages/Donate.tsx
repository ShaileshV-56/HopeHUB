import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Phone, Mail, Calendar, Filter, Package, User } from "lucide-react";
import { API_URL } from "../config/backend";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { foodRequestApi } from "@/services/api";
import Header from "@/components/Header";

interface FoodRequest {
  id: string;
  requester_name: string;
  phone: string;
  email: string | null;
  organization: string | null;
  requested_item: string;
  quantity: string;
  location: string;
  description: string | null;
  needed_by: string;
  status: string;
  created_at: string;
  user_id: string | null;
  requested_total?: number;
  pledged_total?: number;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
};

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
};

const Donate = () => {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const { user } = useAuth();
  const [activePledge, setActivePledge] = useState<{ id: string; value: number } | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/food-requests`);
        if (!response.ok) {
          throw new Error('Failed to load requests');
        }
        const data = await response.json();
        setRequests((data.data || []) as FoodRequest[]);
      } catch (err) {
        setError((err as Error).message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const q = query.toLowerCase();
    return requests.filter((r) => {
      const matchesQuery =
        (r.organization || '').toLowerCase().includes(q) ||
        r.requester_name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.requested_item.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      const matchesAvailable = availableOnly ? r.status === 'active' : true;
      const hasDeadline = Boolean(r.needed_by);
      const deadline = hasDeadline ? new Date(r.needed_by) : null;
      const notExpired = deadline ? deadline.getTime() >= Date.now() : false;
      return matchesQuery && matchesAvailable && notExpired;
    });
  }, [requests, query, availableOnly]);

  const parseRequested = (r: FoodRequest) => r.requested_total ?? (parseInt(String(r.quantity).replace(/\D/g, "")) || 0);
  const parsePledged = (r: FoodRequest) => r.pledged_total ?? 0;
  const remaining = (r: FoodRequest) => Math.max(0, parseRequested(r) - parsePledged(r));

  const submitPledge = async (req: FoodRequest, amount: number) => {
    if (user && req.user_id === user.id) {
      throw new Error('You cannot donate to your own request');
    }
    const res = await foodRequestApi.pledge(req.id, String(amount));
    if (!res.success) throw new Error(res.error || 'Failed to pledge');
    // Refresh list
    const response = await fetch(`${API_URL}/food-requests`);
    const data = await response.json();
    setRequests((data.data || []) as FoodRequest[]);
  };

  return (
    <>
      <Header />
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

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Resource Requests</h1>
            <p className="text-white/80">View all active requests from your community</p>
          </div>

          <Card className="mb-6 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by organization, location, item..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant={availableOnly ? "default" : "outline"}
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className="whitespace-nowrap"
                >
                  {availableOnly ? "Show All" : "Active Only"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center text-white py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4">Loading requests...</p>
            </div>
          )}

          {error && (
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <p className="text-red-500 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && filteredRequests.length === 0 && (
            <Card className="shadow-xl">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Requests Found</h3>
                <p className="text-gray-600">
                  {query || availableOnly
                    ? "Try adjusting your filters"
                    : "There are currently no resource requests"}
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && filteredRequests.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request) => {
                const ownRequest = Boolean(user && request.user_id === user?.id);
                const canDonate = Boolean(user && request.status === 'active' && remaining(request) > 0 && !ownRequest);

                return (
                  <Card key={request.id} className="shadow-xl hover:shadow-2xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">
                          {request.requested_item}
                        </CardTitle>
                        <Badge variant={request.status === 'active' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-2 text-sm">
                        <User className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{request.requester_name}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 text-sm">
                        <Package className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">Requested: {parseRequested(request)} | Pledged: {parsePledged(request)} | Remaining: {remaining(request)}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">Organization: {request.organization || 'Individual'}</p>
                          <p className="text-gray-600">Location: {request.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <a href={`tel:${request.phone}`} className="text-primary hover:underline">
                          {request.phone}
                        </a>
                      </div>

                      {request.email && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <a href={`mailto:${request.email}`} className="text-primary hover:underline truncate">
                            {request.email}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <p className="text-gray-600">Needed by: {formatDate(request.needed_by)}</p>
                      </div>

                      {request.description && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-gray-600 line-clamp-3">{request.description}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Submitted: {formatDateTime(request.created_at)}
                        </p>
                      </div>

                      {(ownRequest || canDonate) && (
                        <div className="pt-3 border-t">
                          {ownRequest ? (
                            <p className="text-sm text-muted-foreground">You created this request. Other community members can donate to support you.</p>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full">Donate to this request</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>How much would you like to donate?</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="text-sm text-muted-foreground">Remaining needed: {remaining(request)}</div>
                                  <Slider
                                    defaultValue={[Math.min(remaining(request), 1)]}
                                    max={Math.max(1, remaining(request))}
                                    min={1}
                                    step={1}
                                    onValueChange={(v) => setActivePledge({ id: request.id, value: v[0] })}
                                  />
                                  <div className="text-sm">You will donate: {activePledge?.id === request.id ? activePledge.value : 1}</div>
                                  <Button onClick={async () => {
                                    const amount = activePledge?.id === request.id ? activePledge.value : 1;
                                    await submitPledge(request, amount);
                                  }}>Confirm Donation</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Donate;
