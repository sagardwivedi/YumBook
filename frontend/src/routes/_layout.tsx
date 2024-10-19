import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  ChefHat,
  Heart,
  Home,
  type LucideProps,
  MessageCircle,
  PlusSquare,
  Search,
} from "lucide-react";
import { MoreComponent } from "~/components/More";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useUserStore } from "~/hooks/use-user";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen">
      <div className="dark:bg-secondary text-gray-900 dark:text-gray-100 flex">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-min lg:w-64 bg-white dark:bg-primary-foreground border-r border-gray-200 dark:border-gray-700 fixed top-0 bottom-0 left-0 z-10 hidden md:flex md:flex-col">
          <div className="p-4 lg:flex lg:items-center lg:gap-2">
            <ChefHat className="ml-2" />
            <h1 className="max-lg:hidden text-xl font-bold text-primary dark:text-primary flex items-center">
              YumBook
            </h1>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              <DesktopNavItem icon={Home} text="Home" to="/home" />
              <DesktopNavItem icon={Search} text="Explore" to="/explorer" />
              <DesktopNavItem
                icon={MessageCircle}
                text="Messages"
                to="/messages"
              />
              <DesktopNavItem icon={Bell} text="Notifications" to="/activity" />
              <DesktopNavItem icon={PlusSquare} text="Create" to="/create" />
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
                          <AvatarFallback>
                            {user?.username[0].toUpperCase()}
                          </AvatarFallback>
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
            <MoreComponent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 mb-16 md:pb-0 md:pt-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10 md:hidden">
          <div className="flex justify-around items-center h-16">
            <MobileNavItem icon={Home} text="Home" to="/home" />
            <MobileNavItem icon={Search} text="Explore" to="/explorer" />
            <MobileNavItem icon={PlusSquare} text="Create" to="/create" />
            <MobileNavItem icon={Heart} text="Activity" to="/activity" />
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/$profile"
                params={{ profile: user ? user.username : "" }}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`http://localhost:8000/${user?.profile_picture}`}
                    alt={user?.username[0].toUpperCase()}
                  />
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

interface DesktopNavItemProps {
  to: string;
  text: string;

  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

function DesktopNavItem({ icon: Icon, text, to }: DesktopNavItemProps) {
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
        <TooltipContent side="right">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface MobileNavItemProps {
  to: string;
  text: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

function MobileNavItem({ icon: Icon, text, to }: MobileNavItemProps) {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href={to}>
        <Icon className="size-6" />
        <span className="sr-only">{text}</span>
      </Link>
    </Button>
  );
}
