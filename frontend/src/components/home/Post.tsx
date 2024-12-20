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
import type {
  GetLikersData,
  GetLikersResponse,
  LikePublic,
  RecipeWithUser,
  UserForRecipe,
} from "~/client";
import { ScrollArea } from "~/components/ui/scroll-area";
import useRecipe from "~/hooks/use-recipe";
import { useResponsiveUI } from "~/hooks/use-responsive-ui";
import useSharePost from "~/hooks/use-share-post";
import { calculateTimeForPosting } from "~/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Recipe } from "./ShowRecipe";

// Types
interface IconButtonProps {
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

interface UserInfoProps {
  user: RecipeWithUser["user"];
  time: string;
  id: string;
}

interface PostProps {
  user: RecipeWithUser["user"];
  recipe: RecipeWithUser["recipe"];
}

const IconButton: FC<IconButtonProps> = ({ icon: Icon, color, onClick }) => (
  <Button onClick={onClick} size="icon" variant="ghost" asChild>
    <Icon
      className={`${color} w-7 h-7 cursor-pointer transition-colors duration-200`}
    />
  </Button>
);

const UserInfo: FC<UserInfoProps> = ({ user, time, id }) => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage
        src={
          user.avatar_path
            ? `http://localhost:8000/${user.avatar_path}`
            : undefined
        }
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
    className="w-full px-4 py-2 hover:bg-secondary/50"
    onClick={onClick}
  >
    {text}
  </Button>
);

const ShowLikesModalOrVaul: FC<{
  likeNumber: number;
  likers?: GetLikersResponse;
}> = ({ likeNumber, likers }) => {
  const UIComponent = useResponsiveUI();
  return (
    <UIComponent.Container>
      <UIComponent.Trigger className="text-sm text-gray-600 mt-2">
        {/* Show only two avatar images */}
        {likeNumber} likes
      </UIComponent.Trigger>
      <UIComponent.Content className="h-96">
        <UIComponent.Header>
          <UIComponent.Title>Likes</UIComponent.Title>
        </UIComponent.Header>
        <ScrollArea className="h-[80vh] pr-4">
          <div>
            {likers ? (
              likers.map((like) => (
                <div key={like.id} className="p-2 border-b">
                  {/* show the avatar image here */}
                  {like.username}
                </div>
              ))
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
        </ScrollArea>
        <UIComponent.Close asChild>
          <Button className="w-full mt-4">Close</Button>
        </UIComponent.Close>
      </UIComponent.Content>
    </UIComponent.Container>
  );
};

// Main Post Component
export const Post: FC<PostProps> = ({ user, recipe }) => {
  const UIComponent = useResponsiveUI();
  const navigate = useNavigate();
  const { sharePost } = useSharePost(recipe.id);
  const { likeMutate, unlikeMutate, commentMutate, likersQuery } = useRecipe({
    recipe_id: recipe.id,
  });

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
      setIsLiked((prev) => !prev);
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <UserInfo user={user} time={postTiming} id={recipe.id} />
        <UIComponent.Container>
          <UIComponent.Trigger asChild>
            <Button size="icon" variant="ghost" aria-label="More options">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </UIComponent.Trigger>
          <UIComponent.Content className="sm:max-w-[425px] p-2">
            <UIComponent.Header className="border-b">
              <UIComponent.Title className="text-center">
                Post Options
              </UIComponent.Title>
              <UIComponent.Description className="text-center">
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
                  navigate({
                    to: "/p/$post",
                    params: { post: recipe.id },
                  })
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

      <CardFooter className="flex flex-col items-start pl-2 pt-4">
        <div className="flex w-full justify-between items-center mb-2">
          <div className="flex gap-2 items-center">
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
              onClick={sharePost}
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
        <ShowLikesModalOrVaul
          likeNumber={totalLikes}
          likers={likersQuery?.data}
        />
      </CardFooter>
    </Card>
  );
};
