import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Search, Sliders } from "lucide-react";
import { useState } from "react";
import { queryClient } from "~/App";
import { getRecipesOptions } from "~/client/@tanstack/react-query.gen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";

export const Route = createFileRoute("/_layout/explorer")({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(getRecipesOptions()),
});

function RouteComponent() {
  const { data: recipes } = useSuspenseQuery(getRecipesOptions());
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxCookingTime, setMaxCookingTime] = useState(120);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const cuisines = Array.from(new Set(recipes.map((r) => r.recipe.cuisine)));
  const allTags = Array.from(
    new Set(recipes.flatMap((r) => r.recipe.tags || [])),
  );

  const filteredRecipes = recipes.filter(({ recipe }) => {
    const matchesQuery = recipe.name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCuisine = !cuisine || recipe.cuisine === cuisine;
    const matchesCookingTime = recipe.cooking_time <= maxCookingTime;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => recipe.tags?.includes(tag));
    return matchesQuery && matchesCuisine && matchesCookingTime && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setCuisine("");
    setMaxCookingTime(120);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Explore Recipes
          </h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search recipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:ring-0"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <Dialog
              open={isFilterDialogOpen}
              onOpenChange={setIsFilterDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Sliders className="h-5 w-5" />
                  {(cuisine ||
                    maxCookingTime < 120 ||
                    selectedTags.length > 0) && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-primary rounded-full" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Recipes</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cuisine">Cuisine</Label>
                    <Select value={cuisine} onValueChange={setCuisine}>
                      <SelectTrigger id="cuisine">
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cuisines</SelectItem>
                        {cuisines.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cooking-time">
                      Max Cooking Time: {maxCookingTime} minutes
                    </Label>
                    <Slider
                      id="cooking-time"
                      min={10}
                      max={120}
                      step={5}
                      value={[maxCookingTime]}
                      onValueChange={([value]) => setMaxCookingTime(value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tags</Label>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              selectedTags.includes(tag) ? "default" : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => handleTagToggle(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsFilterDialogOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map(({ recipe }) => (
            <Link key={recipe.id} to="/p/$post" params={{post:recipe.id}}>
            <div
              
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={`http://localhost:8000/${recipe.image_url}`}
                alt={recipe.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>{recipe.preparation_time}m prep</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>{recipe.cooking_time}m cook</span>
                    </div>
                  </div>
                </div>
              </div>
            </div></Link>
          ))}
        </div>
      </main>
    </div>
  );
}
