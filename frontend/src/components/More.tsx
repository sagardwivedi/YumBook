import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, MoreHorizontal, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useThemeStore } from "~/hooks/use-theme";
import { useUserStore } from "~/hooks/use-user";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export function MoreComponent() {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const { logout } = useUserStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className=" justify-start px-4 py-2">
          <MoreHorizontal className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="grid gap-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/settings">
              <Settings className="size-4 mr-2" />
              Settings
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <span>Dark Mode</span>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
          <Separator />
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="w-full justify-start text-red-600 dark:text-red-400"
          >
            <LogOut className="size-5 mr-2" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
