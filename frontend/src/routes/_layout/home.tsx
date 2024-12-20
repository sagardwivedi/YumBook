import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, MessageCircle, TrendingUp } from "lucide-react";

import { queryClient } from "~/App";
import { getRecipes, type RecipeTrending } from "~/client";
import {
  getRecipesOptions,
  getTrendingRecipesOptions,
} from "~/client/@tanstack/react-query.gen";
import { Post } from "~/components/home/Post";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

export const Route = createFileRoute("/_layout/home")({
  component: Home,
  loader: () => [
    queryClient.ensureQueryData(getRecipesOptions()),
    queryClient.ensureQueryData(getTrendingRecipesOptions()),
  ],
});

function Home() {
  const { data, isLoading, isFetching } = useSuspenseQuery(getRecipesOptions());
  const { data: trendings, isLoading: isTrendingLoading } = useSuspenseQuery(
    getTrendingRecipesOptions(),
  );

  return (
    <div className="flex flex-col">
      <MobileHeader />
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
        <main className="flex-1 space-y-6">
          {isLoading || isFetching ? (
            <LoadingPlaceholder />
          ) : (
            <div className="space-y-6">
              {data.map((r) => (
                <Post key={r.recipe.id} {...r} />
              ))}
            </div>
          )}
        </main>
        <DesktopRightSidebar
          recipes={trendings}
          isLoading={isTrendingLoading}
        />
      </div>
    </div>
  );
}

function MobileHeader() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10 md:hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary dark:text-white flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" />
          <span>YumBook</span>
        </h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/message">
              <MessageCircle className="h-6 w-6 text-primary dark:text-white" />
              <span className="sr-only">Messages</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DesktopRightSidebar({
  recipes,
  isLoading,
}: {
  recipes: RecipeTrending[];
  isLoading: boolean;
}) {
  return (
    <aside className="w-80 lg:w-96 shrink-0 hidden lg:block">
      <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary dark:text-primary-light" />
          Trending Recipes
        </h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {isLoading ? (
            <LoadingPlaceholder />
          ) : (
            <div className="space-y-4">
              {recipes.map((r) => (
                <DesktopRightSidebarItem key={r.id} {...r} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
}

function DesktopRightSidebarItem(recipe: RecipeTrending) {
  const imageSrc = `http://localhost:8000/${recipe.image_url}`;
  return (
    <div className="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out">
      <Avatar className="h-12 w-12">
        <AvatarImage src={imageSrc} alt={recipe.name} />
        <AvatarFallback>{recipe.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ellipsis text-gray-900 dark:text-white">
          {recipe.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          by {recipe.username}
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="shrink-0 dark:text-primary-light dark:hover:text-white"
      >
        <Link to="/p/$post" params={{ post: recipe.id }}>
          View
        </Link>
      </Button>
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2Icon className="text-primary animate-spin size-24 dark:text-primary-light" />
    </div>
  );
}
