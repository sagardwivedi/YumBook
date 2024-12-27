import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  createRecipeMutation,
  getCommentsOptions,
  getCommentsQueryKey,
  getLikersOptions,
  likeRecipeMutation,
  unlikeRecipeMutation,
} from "~/client/@tanstack/react-query.gen";
import { getErrorMessage } from "~/lib/utils";
import { createCommentMutation } from "../client/@tanstack/react-query.gen";
import { useToast } from "./use-toast";
import { queryClient } from "~/App";

const useRecipe = ({ recipe_id }: { recipe_id?: string }) => {
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

  const commentMutate = useMutation({
    ...createCommentMutation(),
    onSuccess: () => {
      // Invalidate getComments query to fetch updated comments
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
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

  const getComments = useQuery({
    ...getCommentsOptions({ path: { recipe_id: recipe_id || "" } }),
  });

  const likersQuery = useQuery({
    ...getLikersOptions({ path: { recipe_id: recipe_id || "" } }),
  });

  return {
    mutate,
    likeMutate,
    unlikeMutate,
    commentMutate,
    likersQuery,
    getComments,
  };
};

export default useRecipe;
