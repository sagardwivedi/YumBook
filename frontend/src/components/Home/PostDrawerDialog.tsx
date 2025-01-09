import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface ResponsiveModalProps {
  trigger: React.ReactNode; // Trigger button or element
  title?: string; // Title of the dialog/drawer
  description?: string; // Description content
  children: React.ReactNode; // Content to display inside the dialog/drawer
  footer?: React.ReactNode; // Optional footer buttons
  className?: string; // Custom className for styling
  animationType?: "fade" | "slide" | "zoom"; // Type of animation
  breakpoint?: number; // Custom breakpoint for responsive behavior
}

export function ResponsiveModal({
  trigger,
  title,
  description,
  children,
  footer,
  className,
  animationType = "fade", // Default animation
  breakpoint = 768, // Default responsive breakpoint
}: ResponsiveModalProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= breakpoint);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  const animationClasses = clsx({
    "transition-opacity duration-300 ease-in-out": animationType === "fade",
    "transition-transform duration-300 ease-in-out transform-gpu":
      animationType === "slide",
    "transition-transform duration-300 ease-in-out transform scale-95":
      animationType === "zoom",
  });

  const HeaderContent = title && (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  const FooterContent = footer && (
    <div className="flex justify-end space-x-2 mt-4">{footer}</div>
  );

  if (isLargeScreen) {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={clsx(
            "max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg",
            animationClasses,
            className,
          )}
        >
          <DialogHeader className="border-b pb-4">{HeaderContent}</DialogHeader>
          <div className={`py-4 ${animationClasses}`}>{children}</div>
          {FooterContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className={clsx(
          "p-6 bg-white rounded-t-lg shadow-md",
          animationClasses,
          className,
        )}
      >
        <DrawerHeader className="border-b pb-4">{HeaderContent}</DrawerHeader>
        <div className={`py-4 ${animationClasses}`}>{children}</div>
        {FooterContent && <DrawerFooter>{FooterContent}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
