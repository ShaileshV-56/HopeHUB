import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url: string;
}

const NewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using mock data for demo - in production you'd use NewsAPI or similar
        const mockNews: NewsItem[] = [
          {
            id: 1,
            title: "Tamil Nadu Government Launches Zero Food Waste Initiative",
            summary: "State government introduces new policies to connect surplus food from hotels and restaurants with feeding centers across Tamil Nadu.",
            publishedAt: "2 hours ago",
            source: "The Hindu",
            url: "https://thehindu.com"
          },
          {
            id: 2,
            title: "Vellore District Collector Inaugurates Food Donation Center",
            summary: "New facility established to streamline food collection and distribution process for helping underprivileged communities in Vellore.",
            publishedAt: "5 hours ago",
            source: "Dinamalar",
            url: "https://dinamalar.com"
          },
          {
            id: 3,
            title: "VIT University Students Launch Campus Food Sharing Program",
            summary: "Student initiative successfully reduces canteen food waste by 60% while feeding local street children and workers.",
            publishedAt: "1 day ago",
            source: "VIT News",
            url: "https://vit.ac.in"
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNews(mockNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle>Food Security News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Food Security News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {news.map((item) => (
            <div key={item.id} className="border-b border-border pb-4 last:border-b-0">
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.publishedAt}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsFeed;