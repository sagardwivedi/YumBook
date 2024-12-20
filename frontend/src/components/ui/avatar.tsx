import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import { forwardRef } from "react";

import { cn } from "~/lib/utils";

const Avatar = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));

Avatar.displayName = Root.displayName;

const AvatarImage = forwardRef<
  React.ComponentRef<typeof Image>,
  React.ComponentPropsWithoutRef<typeof Image>
>(({ className, ...props }, ref) => (
  <Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));

AvatarImage.displayName = Image.displayName;

const AvatarFallback = forwardRef<
  React.ComponentRef<typeof Fallback>,
  React.ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
  <Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));

AvatarFallback.displayName = Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
