import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Quote } from "lucide-react";

interface QuoteData {
  text: string;
  author: string;
}

const QuotesWidget = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  const inspirationalQuotes = [
    {
      text: "No one has ever become poor by giving.",
      author: "Anne Frank"
    },
    {
      text: "The best way to find yourself is to lose yourself in the service of others.",
      author: "Mahatma Gandhi"
    },
    {
      text: "We make a living by what we get, but we make a life by what we give.",
      author: "Winston Churchill"
    },
    {
      text: "The smallest act of kindness is worth more than the greatest intention.",
      author: "Khalil Gibran"
    },
    {
      text: "Alone we can do so little; together we can do so much.",
      author: "Helen Keller"
    },
    {
      text: "If you can't feed a hundred people, then feed just one.",
      author: "Mother Teresa"
    },
    {
      text: "Remember that the happiest people are not those getting more, but those giving more.",
      author: "H. Jackson Brown Jr."
    },
    {
      text: "Food is meant to be shared. It's not just about calories and nutrients.",
      author: "José Andrés"
    },
    {
      text: "Kindness is a language which the deaf can hear and the blind can see.",
      author: "Mark Twain"
    },
    {
      text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.",
      author: "Ralph Waldo Emerson"
    }
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    return inspirationalQuotes[randomIndex];
  };

  const fetchNewQuote = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setQuote(getRandomQuote());
    setLoading(false);
  };

  useEffect(() => {
    fetchNewQuote();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Quote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <blockquote className="text-sm font-medium leading-relaxed text-foreground">
                "{quote.text}"
              </blockquote>
              <cite className="text-xs text-muted-foreground font-medium">
                — {quote.author}
              </cite>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchNewQuote}
              className="h-8 px-3"
              disabled={loading}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              New Quote
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotesWidget;