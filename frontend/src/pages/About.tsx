import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Users, Target, Globe, Award } from "lucide-react";

const About = () => {
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
          
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-white" />
            <span className="text-white font-semibold">HopeHUB</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About HopeHUB
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Fighting hunger together through innovative technology and community collaboration
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/95 backdrop-blur-sm shadow-large">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To eliminate food waste and hunger by connecting food donors with those in need through 
                  our smart platform, creating a sustainable and efficient food distribution network.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-large">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-success" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A world where no food goes to waste and no one goes hungry. We envision communities 
                  united in the fight against hunger through technology and compassion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="text-center">Our Impact</CardTitle>
              <CardDescription className="text-center">
                Making a difference in communities across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                  <div className="text-sm text-muted-foreground">Meals Donated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success mb-2">1,200+</div>
                  <div className="text-sm text-muted-foreground">Active Donors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-warning mb-2">85+</div>
                  <div className="text-sm text-muted-foreground">Cities Covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-info mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">People Fed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-large text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community First</h3>
                <p className="text-muted-foreground text-sm">
                  Building strong communities through collaboration and shared responsibility.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-large text-center">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Compassion</h3>
                <p className="text-muted-foreground text-sm">
                  Leading with empathy and understanding in everything we do.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-large text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                <p className="text-muted-foreground text-sm">
                  Committed to delivering quality service and measurable impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-primary shadow-large">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join Our Mission
              </h3>
              <p className="text-white/90 mb-6">
                Be part of the solution. Start donating or volunteering today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;