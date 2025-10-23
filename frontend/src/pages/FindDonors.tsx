import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Clock, Package, Search, Filter, ChevronDown, ChevronUp, Phone, Mail, User, Calendar } from "lucide-react";

const FindDonors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  
  const toggleExpanded = (donorId: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(donorId)) {
      newExpanded.delete(donorId);
    } else {
      newExpanded.add(donorId);
    }
    setExpandedCards(newExpanded);
  };
  
  // Indian donor data - 50 entries
  const donors = [
    {
      id: 1,
      name: "Taj Palace Restaurant",
      type: "Restaurant",
      location: "Connaught Place, New Delhi",
      distance: "0.5 km",
      rating: 4.8,
      totalDonations: 156,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["North Indian Meals", "Fresh Vegetables"],
      contactPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh@tajpalace.in",
      operatingHours: "9:00 AM - 11:00 PM",
      description: "Premium North Indian restaurant serving authentic cuisine. We regularly donate fresh prepared meals and surplus ingredients to support the community.",
      donationSchedule: "Daily at 9:00 PM",
      specialRequirements: "Please bring insulated containers for hot food items."
    },
    {
      id: 2,
      name: "Reliance Fresh",
      type: "Grocery Store",
      location: "Bandra West, Mumbai",
      distance: "1.2 km",
      rating: 4.6,
      totalDonations: 89,
      lastDonation: "1 day ago",
      availableNow: false,
      categories: ["Bakery Items", "Dairy Products"],
      contactPerson: "Priya Sharma",
      phone: "+91 98876 54321",
      email: "priya@reliancefresh.com",
      operatingHours: "7:00 AM - 10:00 PM",
      description: "Leading grocery retail chain. We donate near-expiry bakery items and dairy products that are still safe for consumption.",
      donationSchedule: "Every Tuesday and Friday at 8:00 PM",
      specialRequirements: "Items need to be collected within 2 hours of notification."
    },
    {
      id: 3,
      name: "Krishna Fruit Market",
      type: "Market",
      location: "Commercial Street, Bangalore",
      distance: "2.1 km",
      rating: 4.9,
      totalDonations: 234,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Fruits", "Vegetables", "Organic Produce"],
      contactPerson: "Suresh Krishna",
      phone: "+91 99887 76543",
      email: "suresh@krishnafruits.in",
      operatingHours: "6:00 AM - 9:00 PM",
      description: "Fresh fruit and vegetable market specializing in organic produce. We donate surplus fruits and vegetables daily to minimize waste.",
      donationSchedule: "Daily at 8:00 PM",
      specialRequirements: "Quick pickup required for optimal freshness."
    },
    {
      id: 4,
      name: "VIT Vellore Cafeteria",
      type: "Educational Institution",
      location: "Hauz Khas, New Delhi",
      distance: "0.8 km",
      rating: 4.7,
      totalDonations: 112,
      lastDonation: "6 hours ago",
      availableNow: true,
      categories: ["Prepared Meals", "Beverages"]
    },
    {
      id: 5,
      name: "Saravana Bhavan",
      type: "Restaurant",
      location: "T. Nagar, Chennai",
      distance: "1.5 km",
      rating: 4.9,
      totalDonations: 287,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["South Indian Meals", "Vegetarian"]
    },
    {
      id: 6,
      name: "Big Bazaar",
      type: "Grocery Store",
      location: "Park Street, Kolkata",
      distance: "2.3 km",
      rating: 4.4,
      totalDonations: 145,
      lastDonation: "5 hours ago",
      availableNow: true,
      categories: ["Packaged Foods", "Dairy", "Snacks"]
    },
    {
      id: 7,
      name: "Haldiram's",
      type: "Restaurant",
      location: "Rajouri Garden, New Delhi",
      distance: "3.1 km",
      rating: 4.6,
      totalDonations: 198,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Sweets", "Snacks", "Traditional Food"]
    },
    {
      id: 8,
      name: "Spencer's Retail",
      type: "Grocery Store",
      location: "Forum Mall, Bangalore",
      distance: "1.8 km",
      rating: 4.5,
      totalDonations: 123,
      lastDonation: "4 hours ago",
      availableNow: false,
      categories: ["Fresh Produce", "Organic Foods"]
    },
    {
      id: 9,
      name: "Punjabi Dhaba",
      type: "Restaurant",
      location: "Sector 17, Chandigarh",
      distance: "0.9 km",
      rating: 4.7,
      totalDonations: 167,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Punjabi Cuisine", "Tandoor Items"]
    },
    {
      id: 10,
      name: "DMart",
      type: "Grocery Store",
      location: "Powai, Mumbai",
      distance: "2.7 km",
      rating: 4.3,
      totalDonations: 98,
      lastDonation: "6 hours ago",
      availableNow: true,
      categories: ["Grocery Items", "Household Products"]
    },
    {
      id: 11,
      name: "Hotel Woodlands",
      type: "Restaurant",
      location: "Mylapore, Chennai",
      distance: "1.4 km",
      rating: 4.8,
      totalDonations: 245,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["Tamil Cuisine", "Filter Coffee"]
    },
    {
      id: 12,
      name: "More Megastore",
      type: "Grocery Store",
      location: "Salt Lake, Kolkata",
      distance: "3.5 km",
      rating: 4.2,
      totalDonations: 87,
      lastDonation: "8 hours ago",
      availableNow: false,
      categories: ["Packaged Foods", "Beverages"]
    },
    {
      id: 13,
      name: "Cafe Coffee Day",
      type: "Cafe",
      location: "MG Road, Pune",
      distance: "0.7 km",
      rating: 4.4,
      totalDonations: 76,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Coffee", "Sandwiches", "Pastries"]
    },
    {
      id: 14,
      name: "Aahar Restaurant",
      type: "Restaurant",
      location: "Laxmi Nagar, New Delhi",
      distance: "2.2 km",
      rating: 4.5,
      totalDonations: 134,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Multi-Cuisine", "Buffet Items"]
    },
    {
      id: 15,
      name: "Food Bazaar",
      type: "Grocery Store",
      location: "Hitech City, Hyderabad",
      distance: "1.9 km",
      rating: 4.6,
      totalDonations: 156,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["Fresh Fruits", "Vegetables", "Dairy"]
    },
    {
      id: 16,
      name: "Meenakshi Bhavan",
      type: "Restaurant",
      location: "Madurai Junction, Madurai",
      distance: "1.3 km",
      rating: 4.9,
      totalDonations: 203,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Chettinad Cuisine", "Traditional Meals"]
    },
    {
      id: 17,
      name: "Heritage Fresh",
      type: "Grocery Store",
      location: "Jubilee Hills, Hyderabad",
      distance: "2.8 km",
      rating: 4.7,
      totalDonations: 178,
      lastDonation: "5 hours ago",
      availableNow: false,
      categories: ["Organic Produce", "Fresh Meat"]
    },
    {
      id: 18,
      name: "Kailash Parbat",
      type: "Restaurant",
      location: "Linking Road, Mumbai",
      distance: "1.1 km",
      rating: 4.6,
      totalDonations: 145,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Chaat", "North Indian", "Desserts"]
    },
    {
      id: 19,
      name: "HyperCITY",
      type: "Grocery Store",
      location: "Malad West, Mumbai",
      distance: "3.2 km",
      rating: 4.4,
      totalDonations: 112,
      lastDonation: "7 hours ago",
      availableNow: true,
      categories: ["Imported Foods", "Gourmet Items"]
    },
    {
      id: 20,
      name: "Udupi Krishna",
      type: "Restaurant",
      location: "Jayanagar, Bangalore",
      distance: "0.6 km",
      rating: 4.8,
      totalDonations: 267,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Udupi Cuisine", "Dosas", "Filter Coffee"]
    },
    {
      id: 21,
      name: "Easyday Club",
      type: "Grocery Store",
      location: "Sector 14, Gurgaon",
      distance: "2.4 km",
      rating: 4.3,
      totalDonations: 94,
      lastDonation: "4 hours ago",
      availableNow: false,
      categories: ["Daily Essentials", "Frozen Foods"]
    },
    {
      id: 22,
      name: "Barbeque Nation",
      type: "Restaurant",
      location: "Koramangala, Bangalore",
      distance: "1.7 km",
      rating: 4.7,
      totalDonations: 189,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["BBQ Items", "Buffet", "Desserts"]
    },
    {
      id: 23,
      name: "Nature's Basket",
      type: "Grocery Store",
      location: "Lower Parel, Mumbai",
      distance: "2.1 km",
      rating: 4.8,
      totalDonations: 223,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Organic Foods", "Premium Produce"]
    },
    {
      id: 24,
      name: "Kareem's",
      type: "Restaurant",
      location: "Old Delhi, New Delhi",
      distance: "3.4 km",
      rating: 4.9,
      totalDonations: 312,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Mughlai Cuisine", "Biryanis", "Kebabs"]
    },
    {
      id: 25,
      name: "Star Bazaar",
      type: "Grocery Store",
      location: "Vashi, Navi Mumbai",
      distance: "2.9 km",
      rating: 4.5,
      totalDonations: 167,
      lastDonation: "6 hours ago",
      availableNow: true,
      categories: ["Household Items", "Fresh Produce"]
    },
    {
      id: 26,
      name: "Rajdhani Thali",
      type: "Restaurant",
      location: "CP Metro, New Delhi",
      distance: "0.8 km",
      rating: 4.6,
      totalDonations: 198,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Gujarati Thali", "Rajasthani Food"]
    },
    {
      id: 27,
      name: "24Seven",
      type: "Convenience Store",
      location: "Banjara Hills, Hyderabad",
      distance: "1.2 km",
      rating: 4.2,
      totalDonations: 78,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["Snacks", "Beverages", "Ready-to-eat"]
    },
    {
      id: 28,
      name: "Paradise Biryani",
      type: "Restaurant",
      location: "Secunderabad, Hyderabad",
      distance: "2.6 km",
      rating: 4.8,
      totalDonations: 234,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Biryanis", "Kebabs", "Hyderabadi Cuisine"]
    },
    {
      id: 29,
      name: "Godrej Nature's Basket",
      type: "Grocery Store",
      location: "Anna Nagar, Chennai",
      distance: "1.8 km",
      rating: 4.7,
      totalDonations: 156,
      lastDonation: "5 hours ago",
      availableNow: false,
      categories: ["Organic Foods", "International Cuisine"]
    },
    {
      id: 30,
      name: "Chowking",
      type: "Restaurant",
      location: "Phoenix Mall, Pune",
      distance: "2.3 km",
      rating: 4.4,
      totalDonations: 123,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Chinese", "Asian Cuisine", "Noodles"]
    },
    {
      id: 31,
      name: "Spencers",
      type: "Grocery Store",
      location: "Camac Street, Kolkata",
      distance: "1.6 km",
      rating: 4.5,
      totalDonations: 145,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Fresh Foods", "Imported Items"]
    },
    {
      id: 32,
      name: "Kwality Walls Parlour",
      type: "Ice Cream Parlour",
      location: "Model Town, New Delhi",
      distance: "1.4 km",
      rating: 4.3,
      totalDonations: 89,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["Ice Creams", "Desserts", "Cold Beverages"]
    },
    {
      id: 33,
      name: "Indian Coffee House",
      type: "Cafe",
      location: "Shivajinagar, Bangalore",
      distance: "0.9 km",
      rating: 4.6,
      totalDonations: 167,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Filter Coffee", "South Indian Breakfast"]
    },
    {
      id: 34,
      name: "Hypercity Retail",
      type: "Grocery Store",
      location: "Thane West, Mumbai",
      distance: "3.1 km",
      rating: 4.4,
      totalDonations: 134,
      lastDonation: "6 hours ago",
      availableNow: false,
      categories: ["Bulk Items", "Fresh Produce"]
    },
    {
      id: 35,
      name: "Moti Mahal",
      type: "Restaurant",
      location: "Daryaganj, New Delhi",
      distance: "2.5 km",
      rating: 4.8,
      totalDonations: 278,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Butter Chicken", "Tandoor", "Mughlai"]
    },
    {
      id: 36,
      name: "Fresh@",
      type: "Grocery Store",
      location: "Whitefield, Bangalore",
      distance: "2.7 km",
      rating: 4.6,
      totalDonations: 189,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Fresh Vegetables", "Fruits", "Dairy"]
    },
    {
      id: 37,
      name: "Pind Balluchi",
      type: "Restaurant",
      location: "Nehru Place, New Delhi",
      distance: "1.9 km",
      rating: 4.7,
      totalDonations: 212,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["Punjabi Food", "Village Style Cooking"]
    },
    {
      id: 38,
      name: "V-Mart",
      type: "Retail Store",
      location: "Karol Bagh, New Delhi",
      distance: "2.2 km",
      rating: 4.2,
      totalDonations: 98,
      lastDonation: "5 hours ago",
      availableNow: true,
      categories: ["Packaged Foods", "Household Items"]
    },
    {
      id: 39,
      name: "Dakshin Restaurant",
      type: "Restaurant",
      location: "ITC Maurya, New Delhi",
      distance: "3.3 km",
      rating: 4.9,
      totalDonations: 267,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["South Indian Fine Dining", "Regional Specialties"]
    },
    {
      id: 40,
      name: "Reliance Smart",
      type: "Grocery Store",
      location: "Electronic City, Bangalore",
      distance: "2.8 km",
      rating: 4.5,
      totalDonations: 156,
      lastDonation: "4 hours ago",
      availableNow: false,
      categories: ["Daily Essentials", "Electronics"]
    },
    {
      id: 41,
      name: "Karim Hotel",
      type: "Restaurant",
      location: "Nizamuddin, New Delhi",
      distance: "2.1 km",
      rating: 4.8,
      totalDonations: 245,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Mutton Curry", "Traditional Recipes"]
    },
    {
      id: 42,
      name: "Aditya Birla More",
      type: "Grocery Store",
      location: "Gachibowli, Hyderabad",
      distance: "1.7 km",
      rating: 4.4,
      totalDonations: 123,
      lastDonation: "6 hours ago",
      availableNow: true,
      categories: ["Supermarket Items", "Home Care"]
    },
    {
      id: 43,
      name: "Copper Chimney",
      type: "Restaurant",
      location: "Worli, Mumbai",
      distance: "1.5 km",
      rating: 4.7,
      totalDonations: 198,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["North Indian", "Tandoor Specialties"]
    },
    {
      id: 44,
      name: "Nilgiris",
      type: "Grocery Store",
      location: "T. Nagar, Chennai",
      distance: "1.3 km",
      rating: 4.6,
      totalDonations: 167,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Premium Foods", "Imported Goods"]
    },
    {
      id: 45,
      name: "Mainland China",
      type: "Restaurant",
      location: "Park Street, Kolkata",
      distance: "2.4 km",
      rating: 4.6,
      totalDonations: 178,
      lastDonation: "1 hour ago",
      availableNow: true,
      categories: ["Chinese Cuisine", "Dim Sum", "Szechuan"]
    },
    {
      id: 46,
      name: "Foodworld",
      type: "Grocery Store",
      location: "Adyar, Chennai",
      distance: "2.6 km",
      rating: 4.3,
      totalDonations: 134,
      lastDonation: "5 hours ago",
      availableNow: false,
      categories: ["Convenience Foods", "Fresh Produce"]
    },
    {
      id: 47,
      name: "Punjab Grill",
      type: "Restaurant",
      location: "Select City Walk, New Delhi",
      distance: "3.5 km",
      rating: 4.8,
      totalDonations: 256,
      lastDonation: "2 hours ago",
      availableNow: true,
      categories: ["Contemporary Punjabi", "Fine Dining"]
    },
    {
      id: 48,
      name: "Metro Cash & Carry",
      type: "Wholesale Store",
      location: "Whitefield, Bangalore",
      distance: "4.1 km",
      rating: 4.2,
      totalDonations: 189,
      lastDonation: "7 hours ago",
      availableNow: true,
      categories: ["Bulk Foods", "Restaurant Supplies"]
    },
    {
      id: 49,
      name: "Vasanta Bhavan",
      type: "Restaurant",
      location: "Besant Nagar, Chennai",
      distance: "1.8 km",
      rating: 4.7,
      totalDonations: 223,
      lastDonation: "3 hours ago",
      availableNow: true,
      categories: ["Traditional South Indian", "Sweets"]
    },
    {
      id: 50,
      name: "Future Group Easy Day",
      type: "Grocery Store",
      location: "Sector 18, Noida",
      distance: "2.9 km",
      rating: 4.4,
      totalDonations: 145,
      lastDonation: "4 hours ago",
      availableNow: true,
      categories: ["Neighborhood Store", "Daily Needs"]
    }
  ];

  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          
          <Link to="/" className="inline-block">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-white" />
              <span className="text-white font-semibold">HopeHUB</span>
            </div>
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Food Donors
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Discover local restaurants, stores, and organizations ready to share their surplus food
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-large">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, location, or food type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/95 backdrop-blur-sm text-center p-4">
              <div className="text-2xl font-bold text-primary">{filteredDonors.length}</div>
              <div className="text-sm text-muted-foreground">Active Donors</div>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm text-center p-4">
              <div className="text-2xl font-bold text-success">
                {filteredDonors.filter(d => d.availableNow).length}
              </div>
              <div className="text-sm text-muted-foreground">Available Now</div>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm text-center p-4">
              <div className="text-2xl font-bold text-warning">591</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm text-center p-4">
              <div className="text-2xl font-bold text-info">2.3km</div>
              <div className="text-sm text-muted-foreground">Avg Distance</div>
            </Card>
          </div>
        </div>

        {/* Donors List */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="bg-white/95 backdrop-blur-sm shadow-large hover:shadow-green transition-smooth">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{donor.name}</h3>
                        <Badge variant="secondary">{donor.type}</Badge>
                        {donor.availableNow && (
                          <Badge className="bg-success text-white">
                            Available Now
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{donor.location} • {donor.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{donor.totalDonations} total donations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Last donation: {donor.lastDonation}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {donor.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(donor.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {donor.rating} rating
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button className="w-full">
                        Connect with Donor
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => toggleExpanded(donor.id)}
                      >
                        {expandedCards.has(donor.id) ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            View Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expandable Details Section */}
                  {expandedCards.has(donor.id) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div>
                          <h4 className="font-semibold mb-3 text-primary">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{donor.contactPerson}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{donor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{donor.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{donor.operatingHours}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Donation Details */}
                        <div>
                          <h4 className="font-semibold mb-3 text-primary">Donation Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{donor.donationSchedule}</span>
                            </div>
                            <div>
                              <span className="font-medium">Special Requirements:</span>
                              <p className="text-muted-foreground mt-1">{donor.specialRequirements}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-primary">About</h4>
                        <p className="text-sm text-muted-foreground">{donor.description}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <Button size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDonors.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-sm text-center p-8">
              <div className="text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No donors found</h3>
                <p>Try adjusting your search criteria or check back later for new donations.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDonors;