import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { useMediaQuery } from "./use-media-query";

export const useResponsiveUI = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop
    ? {
        Container: Dialog,
        Trigger: DialogTrigger,
        Content: DialogContent,
        Header: DialogHeader,
        Title: DialogTitle,
        Description: DialogDescription,
        Close: DialogClose,
      }
    : {
        Container: Drawer,
        Trigger: DrawerTrigger,
        Content: DrawerContent,
        Header: DrawerHeader,
        Title: DrawerTitle,
        Description: DrawerDescription,
        Close: DrawerClose,
      };
};
