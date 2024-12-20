import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Bookmark, Grid, Share2, Settings } from "lucide-react";
import { queryClient } from "~/App";
import {
  getCurrentUserOptions,
  getUserRecipesOptions,
} from "~/client/@tanstack/react-query.gen";

import { MoreComponent } from "~/components/More";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/_layout/accounts/$profile")({
  component: ProfilePage,
  loader: () => [
    queryClient.ensureQueryData(getCurrentUserOptions()),
    queryClient.ensureQueryData(getUserRecipesOptions()),
  ],
});

export default function ProfilePage() {
  const { data: user } = useSuspenseQuery(getCurrentUserOptions());
  const { data: userPosts } = useSuspenseQuery(getUserRecipesOptions());

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage
              src={`http://localhost:8000/${user.avatar_path}`}
              alt={user.username}
              className="object-cover"
            />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.full_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/accounts/edit">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
          <MoreComponent />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{userPosts.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recipes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Followers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Following
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="recipes" className="flex items-center">
            <Grid className="w-4 h-4 mr-2" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recipes">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userPosts.map((post) => (
              <Link
                key={post.id}
                to="/p/$post"
                params={{ post: post.id }}
                className="group relative overflow-hidden rounded-lg"
              >
                <AspectRatio ratio={1}>
                  <img
                    src={`http://localhost:8000/${post.image_url}`}
                    alt={post.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0  bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-2">
                      {post.name}
                    </p>
                  </div>
                </AspectRatio>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
