import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  MapPin, 
  Heart, 
  Flame, 
  Zap, 
  Droplets,
  Wind,
  Thermometer,
  Users,
  Car,
  Home,
  Plus,
  Radio,
  Flashlight
} from "lucide-react";

const EmergencyResources = () => {
  const emergencyContacts = [
    { service: "Emergency Services", number: "112", description: "National Emergency Number" },
    { service: "Police", number: "100", description: "Police Emergency" },
    { service: "Fire Department", number: "101", description: "Fire Emergency" },
    { service: "Medical Emergency", number: "108", description: "Ambulance Services" },
    { service: "Disaster Management", number: "1078", description: "Disaster Relief & Management" },
    { service: "Women Helpline", number: "1091", description: "Women in Distress" },
  ];

  const naturalDisasters = [
    {
      icon: Wind,
      title: "Hurricane & Tornado",
      color: "text-blue-600",
      tips: [
        "Stay indoors and away from windows",
        "Have emergency supplies for 72 hours",
        "Monitor weather alerts continuously",
        "Know your evacuation routes",
        "Secure outdoor furniture and objects"
      ]
    },
    {
      icon: Zap,
      title: "Earthquake",
      color: "text-orange-600",
      tips: [
        "Drop, Cover, and Hold On during shaking",
        "Stay away from glass and heavy objects",
        "If outdoors, move away from buildings",
        "Have earthquake emergency kit ready",
        "Check for gas leaks after earthquake"
      ]
    },
    {
      icon: Droplets,
      title: "Flood",
      color: "text-blue-500",
      tips: [
        "Move to higher ground immediately",
        "Avoid walking in moving water",
        "Turn off utilities if time permits",
        "Don't drive through flooded roads",
        "Listen to emergency broadcasts"
      ]
    },
    {
      icon: Flame,
      title: "Wildfire",
      color: "text-red-600",
      tips: [
        "Evacuate immediately when ordered",
        "Close all windows and doors",
        "Remove flammable vegetation near home",
        "Have go-bag ready with essentials",
        "Monitor air quality and wear masks"
      ]
    },
    {
      icon: Thermometer,
      title: "Extreme Weather",
      color: "text-purple-600",
      tips: [
        "Dress appropriately for conditions",
        "Stay hydrated and seek shelter",
        "Check on elderly neighbors",
        "Avoid unnecessary travel",
        "Keep emergency heating/cooling ready"
      ]
    }
  ];

  const emergencySupplies = [
    {
      category: "Basic Survival",
      items: [
        "Water (1 gallon per person per day for 3 days)",
        "Non-perishable food (3-day supply)",
        "Battery-powered or hand crank radio",
        "Flashlight and extra batteries",
        "First aid kit",
        "Whistle for signaling help"
      ]
    },
    {
      category: "Personal Items",
      items: [
        "Medications (7-day supply)",
        "Personal hygiene items",
        "Important family documents (copies)",
        "Cell phone chargers",
        "Cash in small bills",
        "Emergency contact information"
      ]
    },
    {
      category: "Tools & Supplies",
      items: [
        "Multi-purpose tool or Swiss Army knife",
        "Duct tape and plastic sheeting",
        "Matches in waterproof container",
        "Paper cups, plates, utensils",
        "Garbage bags and zip-lock bags",
        "Wrench to turn off gas"
      ]
    }
  ];

  const firstAidBasics = [
    {
      emergency: "Severe Bleeding",
      steps: [
        "Apply direct pressure with clean cloth",
        "Elevate wounded area above heart if possible",
        "Apply pressure to pressure points if bleeding continues",
        "Call 911 immediately",
        "Do not remove embedded objects"
      ]
    },
    {
      emergency: "Burns",
      steps: [
        "Cool burn with cool (not cold) water",
        "Remove from heat source",
        "Do not use ice or butter",
        "Cover with sterile bandage",
        "Seek medical attention for serious burns"
      ]
    },
    {
      emergency: "Choking",
      steps: [
        "Encourage coughing if person is conscious",
        "Perform Heimlich maneuver if unable to cough",
        "Call 911 if object doesn't dislodge",
        "Continue rescue efforts until help arrives",
        "Learn proper Heimlich technique beforehand"
      ]
    },
    {
      emergency: "Heart Attack",
      steps: [
        "Call 911 immediately",
        "Have person sit down and rest",
        "Loosen tight clothing",
        "Give aspirin if not allergic",
        "Be prepared to perform CPR"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Resources & Safety Information
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Emergency Resources Center
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essential information, safety guides, and resources to help you prepare for and respond to emergency situations. 
            Knowledge saves lives - stay informed and stay safe.
          </p>
        </div>

        {/* Emergency Contacts */}
        <section className="mb-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <Phone className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-red-800">Emergency Contacts</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{contact.service}</h3>
                  <div className="text-3xl font-bold text-red-600 mb-2">{contact.number}</div>
                  <p className="text-muted-foreground">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="disasters" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto mb-8">
            <TabsTrigger value="disasters" className="flex items-center gap-2 py-3">
              <AlertTriangle className="h-4 w-4" />
              Natural Disasters
            </TabsTrigger>
            <TabsTrigger value="supplies" className="flex items-center gap-2 py-3">
              <Shield className="h-4 w-4" />
              Emergency Supplies
            </TabsTrigger>
            <TabsTrigger value="firstaid" className="flex items-center gap-2 py-3">
              <Plus className="h-4 w-4" />
              First Aid
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2 py-3">
              <Home className="h-4 w-4" />
              Emergency Planning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disasters">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {naturalDisasters.map((disaster, index) => (
                <Card key={index} className="hover:shadow-lg transition-smooth">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-muted/50 ${disaster.color}`}>
                        <disaster.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{disaster.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {disaster.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="supplies">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {emergencySupplies.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="firstaid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firstAidBasics.map((emergency, index) => (
                <Card key={index} className="hover:shadow-lg transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-600">{emergency.emergency}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {emergency.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">
                            {stepIndex + 1}
                          </Badge>
                          <p className="text-sm">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planning">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-smooth">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl">Family Emergency Plan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Create Your Plan:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Identify meeting places (local and out-of-area)</li>
                        <li>• Choose an out-of-state contact person</li>
                        <li>• Make copies of important documents</li>
                        <li>• Plan for pets and special needs</li>
                        <li>• Practice your evacuation plan</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-smooth">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Car className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-xl">Evacuation Checklist</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Before You Leave:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Grab your emergency go-bag</li>
                        <li>• Turn off utilities if time permits</li>
                        <li>• Lock your home</li>
                        <li>• Follow designated evacuation routes</li>
                        <li>• Listen to emergency broadcasts</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-smooth lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Radio className="h-6 w-6 text-purple-600" />
                    <CardTitle className="text-xl">Stay Informed</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Alert Systems:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Sign up for local emergency alerts</li>
                        <li>• Download weather apps with warnings</li>
                        <li>• Follow local emergency management on social media</li>
                        <li>• Keep battery-powered radio for updates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Information Sources:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• National Weather Service</li>
                        <li>• Local emergency management</li>
                        <li>• American Red Cross</li>
                        <li>• FEMA mobile app</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <h3 className="text-2xl font-bold">Share This Information</h3>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Emergency preparedness saves lives. Share these resources with your family, friends, and community. 
                Together, we can build more resilient and prepared communities.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Share with Family
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Community Safety
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Preparedness
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EmergencyResources;