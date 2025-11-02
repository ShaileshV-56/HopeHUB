import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import QuotesWidget from "@/components/QuotesWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <QuotesWidget />
      </div>
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
