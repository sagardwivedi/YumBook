import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  BookmarkIcon,
  ChefHatIcon,
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

export const Route = createFileRoute('/_layout/home')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
          <div className="container md:hidden mx-auto px-4 py-2 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHatIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">YumBook</span>
            </Link>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>
                      <UserIcon className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    Saved Recipes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <Card className=" my-4 max-w-3xl mx-auto container">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>
                  <UserIcon className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <Input placeholder="Share a new recipe..." />
              <Button size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Recipe posts */}
            {[1, 2, 3, 4, 5].map((i) => (
              <RecipePost key={i} />
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function RecipePost() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>
              <UserIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Chef John Doe</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              2 hours ago
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Just made this amazing pasta dish! Here's the recipe:
        </p>
        <img
          src="/placeholder.svg?height=300&width=600"
          alt="Delicious Pasta Dish"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h4 className="font-semibold text-lg mb-2">Delicious Pasta Dish</h4>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="mr-4">⏱️ 30 mins</span>
          <span>👥 4 servings</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This easy-to-make pasta dish is perfect for a quick weeknight dinner.
          It's creamy, flavorful, and sure to become a family favorite!
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <HeartIcon className="h-5 w-5 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircleIcon className="h-5 w-5 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm">
          <BookmarkIcon className="h-5 w-5 mr-1" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
