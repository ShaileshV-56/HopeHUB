import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, MapPin, Users, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Request Resources", href: "/request-resources", icon: MapPin },
    { name: "Donate", href: "/donate", icon: Heart },
    { name: "Organizations", href: "/organizations", icon: Users },
    { name: "Register Organization", href: "/register-organization", icon: Users },
  ];

  return (
    <header className="bg-gradient-primary shadow-soft sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HopeHUB</h1>
              <p className="text-white/80 text-xs">Food & Shelter Aid Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-smooth"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="secondary" size="sm">
                    Sign In / Sign Up
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Offer Help
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-white/90 hover:text-white transition-smooth py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 text-white py-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Sign In / Sign Up
                      </Button>
                    </Link>
                    <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/30 text-white hover:bg-white/10 w-full"
                      >
                        Offer Help
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;