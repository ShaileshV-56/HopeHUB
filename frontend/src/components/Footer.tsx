import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Emergency Resources", href: "/emergency-resources" },
        { name: "Contact", href: "/contact" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ]
    }
  ];


  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">HopeHUB</h1>
                  <p className="text-white/80 text-sm">Emergency Aid Platform</p>
                </div>
              </div>
              
              <p className="text-white/90 mb-6 leading-relaxed">
                Connecting emergency responders with people in crisis through our comprehensive aid platform. 
                Together, we're building resilient communities prepared for any emergency.
              </p>

            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href.startsWith('#') ? (
                        <a
                          href={link.href}
                          className="text-white/80 hover:text-white transition-smooth"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-white/80 hover:text-white transition-smooth"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/80 text-sm">
              © {currentYear} HopeHUB. All rights reserved. Built with ❤️ for safer communities.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/80">
              <Link to="/privacy" className="hover:text-white transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;