import {
  ChefHat,
  Clock,
  Flame,
  type LucideIcon,
  Tag,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { RecipeWithUser } from "~/client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useResponsiveUI } from "~/hooks/use-responsive-ui";

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

const QuickStat = ({ Icon, value, label }: QuickStatProps) => (
  <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
    <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {value} {label}
    </span>
  </div>
);

const DetailCard = ({ label, value, Icon, className }: DetailCardProps) => (
  <div
    className={`bg-secondary/40 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 ${className}`}
  >
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      <h4 className="font-medium text-gray-800 dark:text-gray-200">{label}</h4>
    </div>
    <p className="text-primary text-sm text-center">{value}</p>
  </div>
);

const InstructionStep = ({ number, instruction }: InstructionStepProps) => (
  <div className="flex gap-4 items-start p-4 bg-secondary/20 rounded-lg">
    <span className="flex-shrink-0 bg-primary/10 text-primary font-medium h-6 w-6 flex items-center justify-center rounded-full">
      {number}
    </span>
    <p className="text-gray-700 dark:text-gray-300">{instruction}</p>
  </div>
);

export const Recipe = ({ recipe }: { recipe: RecipeWithUser["recipe"] }) => {
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

      <UIComponent.Content className="sm:max-w-[525px]">
        <UIComponent.Header>
          <UIComponent.Title className="text-2xl font-semibold">
            {recipe.name}
          </UIComponent.Title>
          <UIComponent.Description>
            Detailed recipe information and instructions
          </UIComponent.Description>
        </UIComponent.Header>
        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
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
                    <Badge
                      key={diet}
                      variant="outline"
                      className="bg-green-50 dark:bg-green-900"
                    >
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
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
                  <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Tags
                  </h4>
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
        </ScrollArea>
      </UIComponent.Content>
    </UIComponent.Container>
  );
};
