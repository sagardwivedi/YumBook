import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, Bell, LogOut, Sparkles } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export function FooterSidebar({
  user,
  isMobile,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  isMobile: boolean;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="flex items-center w-full px-4 py-2 space-x-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">JD</AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col text-left text-sm">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-gray-500">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg shadow-md bg-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <span className="block font-semibold">{user.name}</span>
                  <span className="block text-xs text-gray-500">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 w-5 h-5 text-orange-500" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 w-5 h-5 text-orange-500" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="mr-2 w-5 h-5 text-orange-500" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 w-5 h-5 text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
