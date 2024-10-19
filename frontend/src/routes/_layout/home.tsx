import { Link, createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_layout/home")({
  component: Home,
});

function Home() {
  return (
    <div>
      <MobileHeader />
      <PostCard />
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

function PostCard() {
  return <div>Hello</div>;
}
