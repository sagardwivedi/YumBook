import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import {
  CakeIcon,
  HeartIcon,
  MapPinIcon,
  MessageCircleIcon,
  PenIcon,
  UserIcon,
} from "lucide-react";

import { readOtherUserOptions } from "~/client/@tanstack/react-query.gen";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useUserStore from "~/hooks/use-user-store";
import { queryClient } from "~/index";

export const Route = createFileRoute("/_layout/$profile")({
  component: ProfilePage,
  loader: ({ params }) =>
    queryClient.ensureQueryData(
      readOtherUserOptions({ path: { username: params.profile } })
    ),
});

function ProfilePage() {
  const user = useLoaderData({ from: "/_layout/$profile" });
  const { user: userMe } = useUserStore();

  const isMyProfile = userMe?.username === user.username;

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src="/placeholder-user.jpg" alt="Chef John Doe" />
              <AvatarFallback>
                <UserIcon className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Passionate food lover and recipe creator
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              {isMyProfile ? (
                <>
                  <Button variant="outline">
                    <PenIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : undefined}
            </div>
            <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                <strong>256</strong> Recipes
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Hello, I'm John! I've been cooking for over 15 years and love to
                share my culinary adventures. From quick weeknight dinners to
                elaborate weekend feasts, I'm always experimenting in the
                kitchen.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  New York, USA
                </span>
                <span className="flex items-center">
                  <CakeIcon className="h-4 w-4 mr-1" />
                  Joined March 2020
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recipes Tabs */}
          <Tabs defaultValue="my-recipes" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="saved-recipes">Saved Recipes</TabsTrigger>
              <TabsTrigger value="liked-recipes">Liked Recipes</TabsTrigger>
            </TabsList>
            <TabsContent value="my-recipes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                1
              </div>
            </TabsContent>
            <TabsContent value="saved-recipes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                2
              </div>
            </TabsContent>
            <TabsContent value="liked-recipes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                3
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
}

function RecipeCard() {
  return (
    <Card>
      <CardHeader className="p-0">
        <img
          src="/placeholder.svg?height=200&width=400"
          alt="Recipe"
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">Delicious Pasta Dish</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          A creamy and flavorful pasta recipe that's perfect for any occasion.
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="mr-4">⏱️ 30 mins</span>
          <span>👥 4 servings</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <HeartIcon className="h-4 w-4 mr-1" />
              24
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircleIcon className="h-4 w-4 mr-1" />3
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <PenIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
