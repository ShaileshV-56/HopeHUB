import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-food-donation.jpg";

const Hero = () => {
  const stats = [
    { icon: Users, value: "200+", label: "Active Helpers" },
    { icon: MapPin, value: "50+", label: "Locations" },
    { icon: Clock, value: "24/7", label: "Emergency Support" },
    { icon: TrendingUp, value: "5000+", label: "People Helped" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Food donation community" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connect Help
              <span className="block text-secondary">to Those in Crisis</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Bridge the gap between emergency responders and people in crisis. Our platform connects 
              aid organizations, volunteers, and resources with communities facing emergencies and disasters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/donate">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Donate
                </Button>
              </Link>
              <Link to="/request-resources">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Request Resources
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Quick Action Cards */}
          <div className="animate-slide-up animation-delay-200">
            <div className="grid gap-6">
              <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-large hover:shadow-green transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">For Helpers</h3>
                    <p className="text-muted-foreground">Volunteers, organizations, responders</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Turn your skills and resources into hope. Connect with emergency situations 
                  and make a direct impact in your community during crises.
                </p>
                <Link to="/register-organization">
                  <Button className="w-full mt-4" variant="outline">
                    Register Organization
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-large hover:shadow-green transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-warm rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">For Emergency Responders</h3>
                    <p className="text-muted-foreground">Emergency services, relief organizations</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Access real-time emergency reports and resources. Coordinate response 
                  efforts and distribute aid efficiently during critical situations.
                </p>
                <Link to="/organizations">
                  <Button className="w-full mt-4" variant="outline">
                    Registered Organizations
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;