import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  ChefHat,
  Heart,
  Home,
  LogOut,
  type LucideProps,
  MessageCircle,
  MoreHorizontal,
  PlusSquare,
  Search,
  Settings,
  Sun,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useThemeStore } from "~/hooks/use-theme";
import { useUserStore } from "~/hooks/use-user";
export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useUserStore();

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 dark:bg-secondary text-gray-900 dark:text-gray-100 flex">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-min lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed top-0 bottom-0 left-0 z-10 hidden md:flex md:flex-col">
          <div className="p-4 lg:flex lg:items-center lg:gap-2">
            <ChefHat className="ml-2" />
            <h1 className="max-lg:hidden text-xl font-bold text-primary dark:text-primary flex items-center">
              YumBook
            </h1>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              <NavItem icon={Home} text="Home" to="/home" toolTipContent="Home" />
              <NavItem icon={Search} text="Explore" to="/explorer" toolTipContent="Explore" />
              <NavItem icon={MessageCircle} text="Messages" to="/messages" toolTipContent="Messages" />
              <NavItem icon={Bell} text="Notifications" to="/activity" toolTipContent="Notifications" />
              <NavItem icon={PlusSquare} text="Create" to="/create" toolTipContent="Create Recipe" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2"
                      asChild
                    >
                      <Link
                        to="/$profile"
                        params={{ profile: user ? user.username : "" }}
                      >
                        <Avatar className="h-5 w-5 mr-4">
                          <AvatarImage src={user?.profile_picture} alt="User" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:inline">Profile</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </ScrollArea>
          <div className="p-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2"
                >
                  <MoreHorizontal className="h-5 w-5 mr-4" />
                  <span className="hidden lg:inline">More</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start">
                <div className="grid gap-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Dark Mode</span>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="bg-inherit fixed top-0 left-0 right-0 z-10 md:hidden">
          <div className="flex items-center justify-between p-4">
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

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-16 pb-16 md:pb-0 md:pt-0">
          <div className="container mx-auto">
            <ScrollArea className="h-screen">
              <Outlet />
            </ScrollArea>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10 md:hidden">
          <div className="flex justify-around items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/home">
                <Home className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/explorer">
                <Search className="h-6 w-6" />
                <span className="sr-only">Explore</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/create">
                <PlusSquare className="h-6 w-6" />
                <span className="sr-only">Create</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/activity">
                <Heart className="h-6 w-6" />
                <span className="sr-only">Activity</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/$profile"
                params={{ profile: user ? user.username : "" }}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.profile_picture} alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  text: string;
  toolTipContent: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

function NavItem({ icon: Icon, text, to, toolTipContent }: NavItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2"
            asChild
          >
            <Link to={to}>
              <Icon className="h-5 w-5 mr-4" />
              <span className="hidden lg:inline">{text}</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{toolTipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
