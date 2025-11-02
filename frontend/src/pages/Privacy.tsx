import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Shield, Eye, Lock, UserCheck } from "lucide-react";

const Privacy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and use your information.
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

          {/* Overview */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Privacy Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                At HopeHUB, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                food donation platform.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-6 w-6 text-success" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Address and location information</li>
                  <li>Organization details (for NGOs and businesses)</li>
                  <li>Profile picture and preferences</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Usage Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Donation history and patterns</li>
                  <li>Platform usage statistics</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-warning" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitate food donations and connections between donors and recipients</li>
                <li>Verify the identity of organizations and ensure platform security</li>
                <li>Send notifications about donation opportunities and platform updates</li>
                <li>Analyze platform usage to improve our services</li>
                <li>Comply with legal requirements and prevent fraudulent activities</li>
                <li>Provide customer support and respond to inquiries</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-info" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>With verified NGOs and food banks to facilitate donations</li>
                <li>With service providers who assist in platform operations</li>
                <li>When required by law or to protect rights and safety</li>
                <li>With your explicit consent for specific purposes</li>
              </ul>
              <p className="mt-3">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt out of non-essential communications</li>
                <li>Data portability for your information</li>
                <li>Object to processing for legitimate interests</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                If you have questions about this Privacy Policy or wish to exercise your rights, 
                please contact us:
              </p>
              <div className="mt-3">
                <p><strong>Email:</strong> privacy@hopehub.org</p>
                <p><strong>Phone:</strong> +91 9872837282</p>
                <p><strong>Address:</strong> 123 Innovation Drive, Cyber City, Gurgaon, Haryana 122002</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;