import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
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
import type { ReactNode } from "react";

import { queryClient } from "~/App";
import { getCurrentUserOptions } from "~/client/@tanstack/react-query.gen";
import { MoreComponent } from "~/components/More";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { isAuthenticated } from "~/hooks/use-auth";
import { useMediaQuery } from "~/hooks/use-media-query";

// Constants
const MOBILE_BREAKPOINT = "(min-width: 1024px)";
const APP_NAME = "YumBook";

// Types
interface NavItemProps {
  to: string;
  text: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

interface NavigationLinkProps extends ButtonProps {
  href: string;
  children: ReactNode;
}

// Route Configuration
export const Route = createFileRoute("/_layout")({
  beforeLoad: async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
  },
  loader: () => queryClient.ensureQueryData(getCurrentUserOptions()),
  component: Layout,
});

// Components
function NavigationLink({ href, children, ...props }: NavigationLinkProps) {
  return (
    <Button variant="ghost" asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function DesktopNavItem({ icon: Icon, text, to }: NavItemProps) {
  const isDesktop = useMediaQuery(MOBILE_BREAKPOINT);

  if (isDesktop) {
    return (
      <NavigationLink href={to} className="justify-start">
        <Icon className="w-8 h-8 mr-4" />
        <span>{text}</span>
      </NavigationLink>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavigationLink href={to} className="w-full justify-start">
            <Icon className="size-8 mr-4" />
          </NavigationLink>
        </TooltipTrigger>
        <TooltipContent side="right">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MobileNavItem({ icon: Icon, text, to }: NavItemProps) {
  return (
    <NavigationLink href={to} size="icon">
      <Icon className="size-6" />
      <span className="sr-only">{text}</span>
    </NavigationLink>
  );
}

function UserAvatar({
  src,
  username,
  size = "default",
}: {
  src: string;
  username: string;
  size?: "default" | "small";
}) {
  const sizeClasses = size === "small" ? "size-6" : "size-8 mr-4";
  const fallbackText = username[0].toUpperCase();

  return (
    <Avatar className={sizeClasses}>
      <AvatarImage src={src} alt={username} className="object-cover" />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}

export default function Layout() {
  const { data: user } = useSuspenseQuery(getCurrentUserOptions());
  const avatarPath = `http://localhost:8000/${user.avatar_path}`;

  return (
    <div className="min-h-screen">
      <div className="dark:bg-secondary text-gray-900 dark:text-gray-100 flex">
        {/* Desktop Sidebar */}
        <aside className="w-min lg:w-64 bg-white dark:bg-primary-foreground border-r border-gray-200 dark:border-gray-700 fixed top-0 bottom-0 left-0 z-10 hidden md:flex md:flex-col">
          {/* App Logo */}
          <div className="p-4 lg:flex lg:items-center lg:gap-2">
            <ChefHat className="ml-2" />
            <h1 className="max-lg:hidden text-xl font-bold text-primary dark:text-primary flex items-center">
              {APP_NAME}
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1 flex flex-col px-2">
            <DesktopNavItem icon={Home} text="Home" to="/home" />
            <DesktopNavItem icon={Search} text="Explore" to="/explorer" />
            <DesktopNavItem
              icon={MessageCircle}
              text="Messages"
              to="/messages"
            />
            <DesktopNavItem icon={Bell} text="Notifications" to="/activity" />
            <DesktopNavItem icon={PlusSquare} text="Create" to="/create" />

            {/* Profile Link */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavigationLink
                    href={`/accounts/${user.username}`}
                    className="w-full justify-start px-4 py-2"
                  >
                    <UserAvatar src={avatarPath} username={user.username} />
                    <span className="hidden lg:inline">Profile</span>
                  </NavigationLink>
                </TooltipTrigger>
                <TooltipContent side="right">Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>

          {/* More Options */}
          <div className="p-4">
            <MoreComponent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-black-950 md:ml-64 mb-16 md:pb-0 md:mb-0 md:pt-0">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10 md:hidden">
          <div className="flex justify-around items-center h-16">
            <MobileNavItem icon={Home} text="Home" to="/home" />
            <MobileNavItem icon={Search} text="Explore" to="/explorer" />
            <MobileNavItem icon={PlusSquare} text="Create" to="/create" />
            <MobileNavItem icon={Heart} text="Activity" to="/activity" />
            <NavigationLink href={`/accounts/${user.username}`} size="icon">
              <UserAvatar
                src={avatarPath}
                username={user.username}
                size="small"
              />
              <span className="sr-only">Profile</span>
            </NavigationLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
