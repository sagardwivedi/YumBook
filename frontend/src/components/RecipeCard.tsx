import {
  Bookmark,
  ChefHat,
  Clock,
  Flame,
  Heart,
  type LucideIcon,
  MessageCircle,
  MoreHorizontal,
  SendIcon,
  Tag,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { FC } from "react";
import type { RecipeWithUser } from "~/client";
import { useMediaQuery } from "~/hooks/use-media-query";
import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { calculateTimeForPosting } from "~/lib/utils";

// Types

interface QuickStatProps {
  Icon: LucideIcon;
  value: string | number;
  label: string;
}

interface DetailCardProps extends QuickStatProps {
  className?: string;
}

interface InstructionStepProps {
  number: number;
  instruction: string;
}

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick?: () => void;
}

// Custom hooks
const useResponsiveUI = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop
    ? {
        Container: Dialog,
        Trigger: DialogTrigger,
        Content: DialogContent,
        Title: DialogTitle,
        Description: DialogDescription,
        Close: DialogClose,
      }
    : {
        Container: Drawer,
        Trigger: DrawerTrigger,
        Content: DrawerContent,
        Title: DrawerTitle,
        Description: DrawerDescription,
        Close: DrawerClose,
      };
};

// Components
const QuickStat: FC<QuickStatProps> = ({ Icon, value, label }) => (
  <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
    <Icon className="h-4 w-4 text-gray-600" />
    <span className="text-sm font-medium text-gray-700">
      {value} {label}
    </span>
  </div>
);

const DetailCard: FC<DetailCardProps> = ({ label, value, Icon, className }) => (
  <div
    className={`bg-secondary/40 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 ${className}`}
  >
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-gray-600" />
      <h4 className="font-medium text-gray-800">{label}</h4>
    </div>
    <p className="text-primary text-sm text-center">{value}</p>
  </div>
);

const InstructionStep: FC<InstructionStepProps> = ({ number, instruction }) => (
  <div className="flex gap-4 items-start p-4 bg-secondary/20 rounded-lg">
    <span className="flex-shrink-0 bg-primary/10 text-primary font-medium h-6 w-6 flex items-center justify-center rounded-full">
      {number}
    </span>
    <p className="text-gray-700">{instruction}</p>
  </div>
);

const IconButton: FC<IconButtonProps> = ({
  icon: Icon,
  label,
  color,
  onClick,
}) => (
  <Button onClick={onClick} aria-label={label} size={"icon"} variant={"ghost"}>
    <Icon className={`${color} h-6 w-6 transition-colors duration-200`} />
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
    <Link to="/accounts/$profile" params={{ profile: user.username }}>
      <span className="font-medium hover:underline dark:text-white cursor-pointer text-gray-800">
        {user.username}
      </span>
    </Link>
    <Link to="/p/$post" params={{ post: id }}>
      <span className="text-gray-400">• {time}</span>
    </Link>
  </div>
);

const ContentItem: FC<{ text: string; onClick?: () => void }> = ({
  text,
  onClick,
}) => (
  <Button variant="ghost" className="w-full border-b" onClick={onClick}>
    {text}
  </Button>
);

const Recipe: FC<{ recipe: RecipeWithUser["recipe"] }> = ({ recipe }) => {
  const UIComponent = useResponsiveUI();

  return (
    <UIComponent.Container>
      <UIComponent.Trigger asChild>
        <Button
          variant="outline"
          className="absolute bottom-4 right-4 shadow-sm hover:shadow-md transition-shadow"
        >
          View Recipe
        </Button>
      </UIComponent.Trigger>

      <UIComponent.Content className="max-h-[90vh] p-6">
        <ScrollArea className="h-[95vh]">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <UIComponent.Title className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {recipe.name}
                </UIComponent.Title>
                <Badge variant="secondary" className="text-sm">
                  {recipe.cuisine}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <QuickStat
                  Icon={Clock}
                  value={recipe.preparation_time + recipe.cooking_time}
                  label="min total"
                />
                <QuickStat
                  Icon={Users}
                  value={recipe.servings}
                  label="servings"
                />
                <QuickStat Icon={Flame} value="Easy" label="" />
              </div>

              {recipe.dietary_restrictions && (
                <div className="flex flex-wrap gap-2">
                  {recipe.dietary_restrictions.map((diet) => (
                    <Badge key={diet} variant="outline" className="bg-green-50">
                      {diet}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description Section */}
            <UIComponent.Description className="bg-secondary/20 italic p-4 rounded-lg">
              {recipe.description}
            </UIComponent.Description>

            {/* Timing Details */}
            <div className="grid grid-cols-2 gap-4">
              <DetailCard
                Icon={UtensilsCrossed}
                label="Prep Time"
                value={`${recipe.preparation_time} min`}
              />
              <DetailCard
                Icon={Clock}
                label="Cook Time"
                value={`${recipe.cooking_time} min`}
              />
            </div>

            {/* Instructions Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Instructions
              </h3>
              <div className="space-y-3">
                {recipe.instructions?.map((instruction, index) => (
                  <InstructionStep
                    key={`instruction-${instruction}`}
                    number={index + 1}
                    instruction={instruction}
                  />
                ))}
              </div>
            </div>

            {/* Tags Section */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-600" />
                  <h4 className="font-medium text-gray-800">Tags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="pt-6">
            <UIComponent.Close asChild>
              <Button
                variant="ghost"
                className="w-full text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Close
              </Button>
            </UIComponent.Close>
          </div>
        </ScrollArea>
      </UIComponent.Content>
    </UIComponent.Container>
  );
};

export const Post: FC<RecipeWithUser> = ({ user, recipe }) => {
  const UIComponent = useResponsiveUI();
  const POST_OPTIONS = [
    "Report",
    "Unfollow",
    "Add to favorites",
    "Go to post",
    "About this account",
  ];

  const postTiming = calculateTimeForPosting(recipe.created_at);

  return (
    <Card className="max-w-lg mx-auto border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <UserInfo user={user} time={postTiming} id={recipe.id} />
        <UIComponent.Container>
          <UIComponent.Trigger asChild>
            <Button size="icon" variant="ghost" aria-label="More options">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </UIComponent.Trigger>
          <UIComponent.Content className="gap-0 m-0 transition-opacity duration-200">
            <UIComponent.Title className="text-lg font-semibold text-gray-900">
              Post Options
            </UIComponent.Title>
            <UIComponent.Description className="text-gray-600">
              Choose an action for this post:
            </UIComponent.Description>
            <div className="mt-4">
              {POST_OPTIONS.map((option) => (
                <ContentItem key={option} text={option} />
              ))}
            </div>
            <UIComponent.Close asChild>
              <Button variant="ghost">Close</Button>
            </UIComponent.Close>
          </UIComponent.Content>
        </UIComponent.Container>
      </CardHeader>

      <CardContent className="relative w-full h-auto">
        <AspectRatio ratio={9 / 6}>
          <img
            src={`http://localhost:8000/${recipe.image_url}`}
            alt={`Recipe: ${recipe.name}`}
            className="w-full h-auto object-cover rounded-lg"
          />
        </AspectRatio>
        <Recipe recipe={recipe} />
      </CardContent>

      <CardFooter className="flex p-4 justify-between border-t">
        <div className="flex gap-4 items-center text-gray-600">
          <IconButton icon={Heart} label="Like" color="hover:text-red-500" />
          <IconButton
            icon={MessageCircle}
            label="Comment"
            color="hover:text-blue-500"
          />
          <IconButton
            icon={SendIcon}
            label="Share"
            color="hover:text-green-500"
          />
        </div>
        <IconButton
          icon={Bookmark}
          label="Save"
          color="hover:text-yellow-500"
        />
      </CardFooter>
    </Card>
  );
};

export default Post;
