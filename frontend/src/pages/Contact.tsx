import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
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
            Contact Us
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you make a difference.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-large">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  We'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-large">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">hello@hopehub.org</p>
                      <p className="text-muted-foreground">support@hopehub.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <Phone className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">+91 9876543210</p>
                      <p className="text-muted-foreground">+91 9878564534</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-muted-foreground">
                        123 Innovation Drive<br />
                        Cyber City, <br />
                        Vellore, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-info/10 rounded-lg">
                      <Clock className="h-6 w-6 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-gradient-primary shadow-large">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    24/7 Emergency Food Distribution
                  </h3>
                  <p className="text-white/90 mb-4">
                    For urgent food distribution needs or emergencies
                  </p>
                  <div className="flex items-center space-x-2 text-white mb-4">
                    <Phone className="h-5 w-5" />
                    <span className="font-semibold">+91 98765 43210</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    Call Emergency Line
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-large">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Have Questions?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Check our FAQ section for quick answers
                  </p>
                  <Button variant="outline">
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;