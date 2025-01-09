import { Post } from "@/components/Home/Post";
import { Story, StorySkeleton } from "@/components/Home/Story";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_layout/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 p-4 max-w-xl mx-auto">
      <div className="mb-6">
        {/* Stories Section */}
        <Suspense fallback={<StorySkeleton />}>
          <Story />
        </Suspense>
      </div>

      {/* Posts Section */}
      <Post />
    </main>
  );
}
