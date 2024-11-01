import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createRecipeMutation,
  getRecipesOptions,
} from "~/client/@tanstack/react-query.gen";
import { getErrorMessage } from "~/lib/utils";
import { useToast } from "./use-toast";
import { useNavigate } from "@tanstack/react-router";

const useRecipe = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutate = useMutation({
    ...createRecipeMutation(),
    onSuccess: () => {
      toast({
        title: "Recipe created",
        description: "Your recipe has been created successfully",
      });
      navigate({to:"/home"})
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
      });
    },
  });

  const getRecipes = useQuery({
    ...getRecipesOptions(),
  });
  return { mutate, getRecipes };
};

export default useRecipe;
