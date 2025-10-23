import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Sparkles } from "lucide-react";

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  cookTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  category: string;
}

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRecipe, setCurrentRecipe] = useState(0);

  const indianRecipes: Recipe[] = [
    {
      id: 1,
      name: "Vegetable Pulao",
      ingredients: ["Rice", "Mixed Vegetables", "Onions", "Spices", "Oil"],
      cookTime: "30 mins",
      servings: 4,
      difficulty: "Easy",
      description: "A fragrant one-pot rice dish perfect for utilizing leftover vegetables.",
      category: "Main Course"
    },
    {
      id: 2,
      name: "Dal Tadka",
      ingredients: ["Lentils", "Onions", "Tomatoes", "Garlic", "Cumin"],
      cookTime: "25 mins",
      servings: 6,
      difficulty: "Easy",
      description: "Protein-rich lentil curry that can feed many with simple ingredients.",
      category: "Curry"
    },
    {
      id: 3,
      name: "Mixed Vegetable Curry",
      ingredients: ["Potatoes", "Cauliflower", "Peas", "Spices", "Coconut"],
      cookTime: "35 mins",
      servings: 5,
      difficulty: "Medium",
      description: "Hearty curry using donated vegetables to create a nutritious meal.",
      category: "Curry"
    },
    {
      id: 4,
      name: "Khichdi",
      ingredients: ["Rice", "Moong Dal", "Turmeric", "Salt", "Ghee"],
      cookTime: "20 mins",
      servings: 4,
      difficulty: "Easy",
      description: "Comforting one-pot meal that's easy to digest and very nutritious.",
      category: "Comfort Food"
    },
    {
      id: 5,
      name: "Poha",
      ingredients: ["Flattened Rice", "Onions", "Mustard Seeds", "Curry Leaves"],
      cookTime: "15 mins",
      servings: 3,
      difficulty: "Easy",
      description: "Quick breakfast dish perfect for utilizing simple donated ingredients.",
      category: "Breakfast"
    },
    {
      id: 6,
      name: "Sambar",
      ingredients: ["Toor Dal", "Vegetables", "Tamarind", "Sambar Powder"],
      cookTime: "40 mins",
      servings: 6,
      difficulty: "Medium",
      description: "South Indian lentil soup that works with any available vegetables.",
      category: "Soup"
    }
  ];

  useEffect(() => {
    const loadRecipes = async () => {
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecipes(indianRecipes);
      setLoading(false);
    };

    loadRecipes();
  }, []);

  const nextRecipe = () => {
    setCurrentRecipe((prev) => (prev + 1) % recipes.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success text-white";
      case "Medium":
        return "bg-warning text-black";
      case "Hard":
        return "bg-destructive text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle>Recipe Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recipes.length === 0) {
    return null;
  }

  const recipe = recipes[currentRecipe];

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Recipe of the Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg">{recipe.name}</h3>
              <p className="text-sm text-muted-foreground">{recipe.description}</p>
            </div>
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {recipe.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.cookTime}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Serves {recipe.servings}
            </div>
            <Badge variant="outline" className="text-xs">
              {recipe.category}
            </Badge>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Ingredients:</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={nextRecipe}
              className="h-8 px-3"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Try Another Recipe
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentRecipe + 1} of {recipes.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeSuggestions;