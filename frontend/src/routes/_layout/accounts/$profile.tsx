import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Bookmark, Grid } from "lucide-react";
import { queryClient } from "~/App";
import { getCurrentUserOptions } from "~/client/@tanstack/react-query.gen";

import { MoreComponent } from "~/components/More";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const Route = createFileRoute("/_layout/accounts/$profile")({
  component: ProfilePage,
  loader: () => queryClient.ensureQueryData(getCurrentUserOptions()),
});

export default function ProfilePage() {
  const { data: user } = useSuspenseQuery(getCurrentUserOptions());

  return (
    <div className="space-y-4 lg:max-w-4xl lg:mx-auto">
      <header className="flex px-4 flex-row items-center justify-between py-2">
        <p className="font-bold text-xl">{user.username}</p>
        <MoreComponent />
      </header>
      <div className="flex px-4 items-center gap-7 lg:gap-36">
        <div className="flex flex-col items-center">
          <Avatar className="size-24 md:size-32">
            <AvatarImage
              src={`http://localhost:8000/${user.avatar_path}`}
              alt={user.username}
            />
            <AvatarFallback>CJ</AvatarFallback>
          </Avatar>
          <h1 className="text-xl">{user.username}</h1>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col items-center">
            <strong>0</strong> <p>recipes</p>
          </div>
          <div className="flex flex-col items-center">
            <strong>0</strong> <p>followers</p>
          </div>
          <div className="flex flex-col items-center">
            <strong>0</strong> <p>following</p>
          </div>
        </div>
      </div>
      <div className="flex px-4 flex-row gap-5 justify-between">
        <Button asChild className="w-full" variant={"outline"}>
          <Link to="/accounts/edit">Edit Profile</Link>
        </Button>
        <Button variant={"outline"} className="w-full">
          Share Profile
        </Button>
      </div>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="w-full justify- gap-10 bg-inherit">
          <TabsTrigger value="recipes" className="flex items-center">
            <Grid className="size-6" />
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <Bookmark className="size-6" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recipes">
          <div className="grid grid-cols-3 gap-0">2</div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="grid grid-cols-3 gap-0">1</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
