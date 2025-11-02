import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, TrendingUp, Bell, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Smart Location Matching",
      description: "AI-powered system connects nearby donors with organizations, optimizing logistics and reducing waste.",
      color: "text-success"
    },
    {
      icon: Clock,
      title: "Real-Time Expiry Tracking",
      description: "Monitor food freshness with automated alerts and priority queuing based on expiration times.",
      color: "text-warning"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect restaurants, grocery stores, NGOs, food banks, and volunteers in one unified platform.",
      color: "text-info"
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Track your contribution with detailed reports on meals saved, people fed, and environmental impact.",
      color: "text-primary"
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get real-time alerts for new donations, pickup schedules, and urgent food distribution needs.",
      color: "text-secondary"
    },
    {
      icon: Shield,
      title: "Verified Organizations",
      description: "All registered NGOs and food banks are verified to ensure food reaches legitimate beneficiaries.",
      color: "text-destructive"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Maximum Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform leverages cutting-edge technology to streamline food donation processes, 
            reduce waste, and ensure efficient distribution to those who need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card shadow-soft hover:shadow-green transition-smooth group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of helpers and organizations already using HopeHUB to provide emergency aid 
              and support communities in crisis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Donate
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;