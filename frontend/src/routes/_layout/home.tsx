import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { queryClient } from "~/App";
import { getRecipesOptions } from "~/client/@tanstack/react-query.gen";
import { Post } from "~/components/RecipeCard";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_layout/home")({
  component: Home,
  loader: () => queryClient.ensureQueryData(getRecipesOptions()),
});

function Home() {
  const { data } = useSuspenseQuery(getRecipesOptions());

  const onLikeToggle = () => {}
  const onSaveToggle = () => {}

  return (
    <div>
      <MobileHeader />
      {data.map((r) => (
        <Post key={r.recipe.id} {...r}  />
      ))}
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
