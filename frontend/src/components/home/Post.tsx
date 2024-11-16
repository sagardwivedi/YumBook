import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  type LucideIcon,
  MessageCircle,
  MoreHorizontal,
  SendIcon,
} from "lucide-react";
import { type FC, useCallback, useMemo, useState } from "react";
import type { RecipeWithUser } from "~/client";
import { useMediaQuery } from "~/hooks/use-media-query";
import useRecipe from "~/hooks/use-recipe";
import { calculateTimeForPosting } from "~/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Recipe } from "./ShowRecipe";

// Types
interface IconButtonProps {
  icon: LucideIcon;

  color: string;
  onClick?: () => void;
}

// Custom hooks
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

const IconButton: FC<IconButtonProps> = ({ icon: Icon, color, onClick }) => (
  <Button onClick={onClick} size="icon" variant="ghost" asChild>
    <Icon
      className={`${color} w-6 h-6 cursor-pointer transition-colors duration-200`}
    />
  </Button>
);

const UserInfo: FC<{
  user: RecipeWithUser["user"];
  time: string;
  id: string;
}> = ({ user, time, id }) => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage
        src={`http://localhost:8000/${user.avatar_path}`}
        alt={`${user.username}'s avatar`}
        className="object-cover"
      />
      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <Link to="/accounts/$profile" params={{ profile: user.username }}>
        <span className="font-medium hover:underline dark:text-white cursor-pointer text-gray-800">
          {user.username}
        </span>
      </Link>
      <Link to="/p/$post" params={{ post: id }}>
        <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
      </Link>
    </div>
  </div>
);

const ContentItem: FC<{ text: string; onClick?: () => void }> = ({
  text,
  onClick,
}) => (
  <Button
    variant="ghost"
    className="w-full justify-start px-4 py-2 hover:bg-secondary/50"
    onClick={onClick}
  >
    {text}
  </Button>
);

export const Post = ({ user, recipe }: RecipeWithUser) => {
  const UIComponent = useResponsiveUI();
  const navigate = useNavigate();
  const { likeMutate, unlikeMutate } = useRecipe();

  const isLikedByUser = useMemo(
    () => recipe.likes.some((like) => like.user_id === user.id),
    [recipe.likes, user.id],
  );

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [isSaved, setIsSaved] = useState(false);
  const [totalLikes, setTotalLikes] = useState(recipe.total_liked || 0);

  const postTiming = useMemo(
    () => calculateTimeForPosting(recipe.created_at),
    [recipe.created_at],
  );

  const handleLike = useCallback(() => {
    try {
      setIsLiked((prevLiked) => !prevLiked);
      setTotalLikes((prev) => prev + (isLiked ? -1 : 1));

      const mutateAction = isLiked ? unlikeMutate : likeMutate;
      mutateAction.mutateAsync({ path: { recipe_id: recipe.id } });
    } catch (error) {
      // Rollback optimistic updates
      setIsLiked((prev) => !prev);
      setTotalLikes((prev) => prev + (isLiked ? 1 : -1));
      console.error("Failed to update like status:", error);
    }
  }, [isLiked, likeMutate, unlikeMutate, recipe.id]);

  return (
    <Card className="max-w-lg mx-auto border-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 pb-2">
        <UserInfo user={user} time={postTiming} id={recipe.id} />
        <UIComponent.Container>
          <UIComponent.Trigger asChild>
            <Button size="icon" variant="ghost" aria-label="More options">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </UIComponent.Trigger>
          <UIComponent.Content className="sm:max-w-[425px]">
            <UIComponent.Header>
              <UIComponent.Title>Post Options</UIComponent.Title>
              <UIComponent.Description>
                Choose an action for this post
              </UIComponent.Description>
            </UIComponent.Header>
            <div className="grid gap-4 py-4">
              <ContentItem text="Report" />
              <ContentItem text="Unfollow" />
              <ContentItem text="Add to favorites" />
              <ContentItem
                text="Go to post"
                onClick={() =>
                  navigate({ to: "/p/$post", params: { post: recipe.id } })
                }
              />
              <ContentItem
                text="About this account"
                onClick={() =>
                  navigate({
                    to: "/accounts/$profile",
                    params: { profile: user.username },
                  })
                }
              />
            </div>
            <UIComponent.Close asChild>
              <Button className="w-full">Close</Button>
            </UIComponent.Close>
          </UIComponent.Content>
        </UIComponent.Container>
      </CardHeader>

      <CardContent className="p-0 relative">
        <AspectRatio ratio={4 / 3}>
          <img
            src={`http://localhost:8000/${recipe.image_url}`}
            alt={`Recipe: ${recipe.name}`}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <Recipe recipe={recipe} />
      </CardContent>

      <CardFooter className="flex flex-col items-start px-0 pl-2  pt-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-4 items-center">
            <IconButton
              icon={Heart}
              color={
                isLiked ? "fill-red-500" : "text-gray-500 hover:text-red-500"
              }
              onClick={handleLike}
            />
            <IconButton
              icon={MessageCircle}
              color="text-gray-500 hover:text-blue-500"
            />
            <IconButton
              icon={SendIcon}
              color="text-gray-500 hover:text-green-500"
            />
          </div>
          <IconButton
            icon={Bookmark}
            color={
              isSaved
                ? "text-yellow-500"
                : "text-gray-500 hover:text-yellow-500"
            }
            onClick={() => setIsSaved(!isSaved)}
          />
        </div>
        <div>{totalLikes} likes</div>
      </CardFooter>
    </Card>
  );
};
