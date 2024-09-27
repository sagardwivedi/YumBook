import { AvatarImage } from '@radix-ui/react-avatar';
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import {
  HomeIcon,
  LogOutIcon,
  Menu,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
  Utensils,
} from 'lucide-react';

import { readMeOptions } from '~/client/@tanstack/react-query.gen';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import useAuth, { isAuthenticated } from '~/hooks/use-auth';
import { useThemeStore } from '~/hooks/use-theme-store';
import useUserStore from '~/hooks/use-user-store';
import { queryClient } from '~/index';

// Memoized static data
const staticLinks = [
  { to: '/home', icon: HomeIcon, label: 'Home' },
  { to: '/explorer', icon: SearchIcon, label: 'Explore' },
  { to: '/create', icon: PlusIcon, label: 'Create' },
  { to: '/$profile', icon: UserIcon, label: 'Profile', isProfile: true },
];

export const Route = createFileRoute('/_layout')({
  beforeLoad: async () => {
    const success = await isAuthenticated();
    if (!success) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: () => queryClient.ensureQueryData(readMeOptions()),
  component: Layout,
});

// Memoized Sidebar Links Component
function SidebarLinks({ username }: { username?: string }) {
  return (
    <nav className="mt-8">
      {staticLinks.map(({ to, icon: Icon, label, isProfile }) => (
        <Link
          key={to}
          to={to}
          params={isProfile ? { profile: username } : undefined} // Apply params only for the profile link
        >
          <Button
            variant="ghost"
            className="w-full dark:hover:bg-gray-500/50 justify-start mb-2"
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}

function Sidebar({
  username,
  onLogout,
}: { username?: string; onLogout: () => void }) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Utensils className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">YumBook</span>
        </Link>
      </div>
      <SidebarLinks username={username} />
      <DropdownMenuComponent onLogout={onLogout} />
    </aside>
  );
}

// Dropdown Menu Component for logout
function DropdownMenuComponent({ onLogout }: { onLogout: () => void }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="absolute w-64 bottom-5">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <Button
            variant="ghost"
            className="w-full dark:hover:bg-gray-500/50 justify-start"
          >
            <Menu className="mr-2 h-4 w-4" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={toggleTheme}>
            <Button variant="ghost" className="w-full h-6 justify-start">
              {theme === 'light' ? (
                <SunIcon className="mr-2 h-4 w-4" />
              ) : (
                <MoonIcon className="mr-2 h-4 w-4" />
              )}
              Appearance
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full h-6 justify-start"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Trending Recipes Component
function TrendingRecipes() {
  const trendingData = [1, 2, 3]; // Ideally this data should come from a hook or API
  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 hidden lg:block p-4">
      <h2 className="font-semibold text-lg mb-4">Trending Recipes</h2>
      {trendingData.map((i) => (
        <div key={i} className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage
              src="/"
              alt={`Recipe ${i}`}
              className="size-12 rounded-full object-cover"
            />
            <AvatarFallback>
              <UserIcon className="size-12 rounded-full object-cover" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Trending Recipe {i}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              1.2k likes
            </p>
          </div>
        </div>
      ))}
    </aside>
  );
}

// Main Layout Component
function Layout() {
  const { logoutMutation } = useAuth();
  const { logout, user } = useUserStore();

  // Handle logout function
  const handleLogout = () => {
    logout();
    logoutMutation.mutate({});
  };

  return (
    <div className="bg-gray-100 flex h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar username={user?.username} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <TrendingRecipes />
    </div>
  );
}
