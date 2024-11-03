import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Search, Sliders } from "lucide-react";
import { queryClient } from "~/App";
import { getRecipesOptions } from "~/client/@tanstack/react-query.gen";
import { Button } from "~/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/_layout/explorer")({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(getRecipesOptions()),
});

function RouteComponent() {
  const { data: recipes } = useSuspenseQuery(getRecipesOptions());

  return (
    <div>
      <header className="sticky top-0 bg-white border-b z-10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Explore</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search"
                className="pl-8 pr-4 py-1 w-full max-w-[200px]"
              />
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sliders className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">h</div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 py-4">
        <div className="grid grid-cols-3 gap-1">
          {recipes.map(({ recipe }) => (
            <div key={recipe.id} className="relative">
              <img
                src={`http://localhost:8000/${recipe.image_url}`}
                alt={`Recipe ${recipe.id}`}
                className={"object-cover"}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center">
                    <Heart className="h-6 w-6 mr-2" />
                    <span>{recipe.preparation_time}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2" />
                    <span>{recipe.cooking_time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
