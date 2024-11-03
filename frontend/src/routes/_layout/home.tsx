import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { queryClient } from "~/App";
import type { RecipePublic } from "~/client";
import {
  getRecipesOptions,
  getTrendingRecipesOptions,
} from "~/client/@tanstack/react-query.gen";
import { Post } from "~/components/RecipeCard";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_layout/home")({
  component: Home,
  loader: () => [
    queryClient.ensureQueryData(getRecipesOptions()),
    queryClient.ensureQueryData(getTrendingRecipesOptions()),
  ],
});

function Home() {
  const { data } = useSuspenseQuery(getRecipesOptions());
  const { data: trendings } = useSuspenseQuery(getTrendingRecipesOptions());

  return (
    <div>
      <MobileHeader />
      <div className="flex flex-row bg-red-800">
        <div className=" flex-1">
          {data.map((r) => (
            <Post key={r.recipe.id} {...r} />
          ))}
        </div>
        {trendings.map((trending) => (
          <DesktopRightSidebar key={trending.id} {...trending} />
        ))}
      </div>
    </div>
  );
}

function MobileHeader() {
  return (
    <header className="bg-inherit px-4 py-2 md:hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary dark:text-primary flex items-center">
          YumBook
        </h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/messages">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DesktopRightSidebar(recipeT: RecipePublic) {
  return <div className="max-lg:hidden">{JSON.stringify(recipeT)}</div>;
}
