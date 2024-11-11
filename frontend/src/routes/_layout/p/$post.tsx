import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ChefHat,
  Clock,
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Users,
} from "lucide-react";
import {
  getCurrentUserOptions,
  getRecipeOptions,
  getSimilarRecipesOptions,
} from "~/client/@tanstack/react-query.gen";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/_layout/p/$post")({
  component: RouteComponent,
});

function RouteComponent() {
  const { post } = Route.useParams();
  const { data: recipe } = useSuspenseQuery(
    getRecipeOptions({ path: { recipe_id: post } }),
  );
  const { data: user } = useSuspenseQuery(getCurrentUserOptions());
  const { data: similarRecipes } = useSuspenseQuery(
    getSimilarRecipesOptions({ path: { recipe_id: post } }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={`http://localhost:8000/${user.avatar_path}`}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  to="/accounts/$profile"
                  params={{ profile: user.username }}
                  className="font-semibold hover:underline"
                >
                  {user.username}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="outline">Follow</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center">
            <img
              src={`http://localhost:8000/${recipe.image_url}`}
              alt={recipe.name}
              className="rounded-lg mb-6"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {recipe.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{recipe.cuisine}</Badge>
            {recipe.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Prep: {recipe.preparation_time} mins</span>
            </div>
            <div className="flex items-center">
              <Flame className="mr-2 h-4 w-4" />
              <span>Cook: {recipe.cooking_time} mins</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Serves: {recipe.servings}</span>
            </div>
            <div className="flex items-center">
              <ChefHat className="mr-2 h-4 w-4" />
              <span>Difficulty: {recipe.difficulty}</span>
            </div>
          </div>
          <Separator className="my-6" />
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions?.map((instruction, index) => (
              <li
                key={instruction}
                className="text-gray-600 dark:text-gray-300"
              >
                {instruction}
              </li>
            ))}
          </ol>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline">Save Recipe</Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Similar Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarRecipes.map((similarRecipe) => (
          <Card key={similarRecipe.id}>
            <CardHeader className="p-0">
              <img
                src={`http://localhost:8000/${similarRecipe.image_url}`}
                alt={similarRecipe.name}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">
                {similarRecipe.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mb-2">
                {similarRecipe.cuisine}
              </p>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {similarRecipe.preparation_time + similarRecipe.cooking_time}{" "}
                  mins
                </span>
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {similarRecipe.servings} servings
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  to="/p/$post"
                  params={{ post: similarRecipe.id.toString() }}
                >
                  View Recipe
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
