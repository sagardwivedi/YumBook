import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  createRecipeMutation,
  getRecipesOptions,
  likeRecipeMutation,
  unlikeRecipeMutation,
} from "~/client/@tanstack/react-query.gen";
import { getErrorMessage } from "~/lib/utils";
import { useToast } from "./use-toast";

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
      navigate({ to: "/home" });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const likeMutate = useMutation({
    ...likeRecipeMutation(),
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const unlikeMutate = useMutation({
    ...unlikeRecipeMutation(),
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return { mutate, likeMutate, unlikeMutate };
};

export default useRecipe;
