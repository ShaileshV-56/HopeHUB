import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, FileText, AlertTriangle, Users, Scale } from "lucide-react";

const Terms = () => {
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
            Terms of Service
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Last Updated */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                Last updated: September 8, 2025
              </p>
            </CardContent>
          </Card>

          {/* Agreement */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                By accessing or using HopeHUB's services, you agree to be bound by these Terms of Service and 
                our Privacy Policy. If you disagree with any part of these terms, you may not access our service.
              </p>
            </CardContent>
          </Card>

          {/* Platform Description */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-success" />
                Platform Description
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                HopeHUB is a digital platform that connects food donors (restaurants, grocery stores, 
                individuals) with organizations that distribute food to those in need (NGOs, food banks, 
                community centers). We facilitate these connections but do not directly handle food donations.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-4">
              <div>
                <h4 className="font-semibold mb-2">For Food Donors:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Ensure all donated food is safe for consumption and meets health standards</li>
                  <li>Provide accurate information about food types, quantities, and expiration dates</li>
                  <li>Honor commitments made through the platform</li>
                  <li>Comply with local food safety regulations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">For Recipients/Organizations:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Verify legitimacy and provide accurate organization information</li>
                  <li>Handle received food safely and distribute to intended beneficiaries</li>
                  <li>Respect pickup times and communication with donors</li>
                  <li>Maintain transparency in food distribution activities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Food Safety */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                Food Safety & Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                <strong>Important:</strong> HopeHUB serves as a connecting platform only. We do not:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Inspect, test, or guarantee the safety of donated food</li>
                <li>Take responsibility for food safety or quality</li>
                <li>Assume liability for any health issues related to donated food</li>
                <li>Control the actual transfer or handling of food items</li>
              </ul>
              <p className="mt-3">
                All users participate at their own risk and are responsible for ensuring food safety compliance 
                according to local laws and regulations.
              </p>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Users may not:</p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Use the platform for commercial food sales</li>
                <li>Provide false or misleading information</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with platform security or functionality</li>
                <li>Use the platform for any purpose other than food donation facilitation</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account Terms */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Account Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul className="list-disc pl-6 space-y-1">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for maintaining account security</li>
                <li>One account per user or organization</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                <li>You must notify us immediately of any unauthorized account use</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-info" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                HopeHUB is provided "as is" without warranties of any kind. To the maximum extent permitted by law, 
                we disclaim all liability for:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Food safety or quality issues</li>
                <li>Damages arising from platform use</li>
                <li>Actions or omissions of platform users</li>
                <li>Service interruptions or technical issues</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant 
                changes, and continued use of the platform constitutes acceptance of updated terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>For questions about these Terms of Service, contact us:</p>
              <div className="mt-3">
                <p><strong>Email:</strong> legal@hopehub.org</p>
                <p><strong>Phone:</strong> +91 11 4567 8900</p>
                <p><strong>Address:</strong> 123 Innovation Drive, Cyber City, Gurgaon, Haryana 122002</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;