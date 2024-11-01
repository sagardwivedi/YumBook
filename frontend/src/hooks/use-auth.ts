import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  loginUserMutation,
  logoutUserMutation,
  registerUserMutation,
} from "~/client/@tanstack/react-query.gen";
import { getErrorMessage } from "~/lib/utils";
import { useToast } from "./use-toast";
import { getCurrentUser } from "~/client";

export const isAuthenticated = async () => {
  const { data } = await getCurrentUser();
  return !!data;
};

const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginMutation = useMutation({
    ...loginUserMutation(),
    onSuccess: ({ detail }) => {
      navigate({ to: "/home" });
      toast({ title: "Success", description: detail });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({ title: "Error", description: errorMessage });
    },
  });

  const registerMutation = useMutation({
    ...registerUserMutation(),
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({ title: "Error", description: errorMessage });
    },
  });
  const logoutMutation = useMutation({
    ...logoutUserMutation(),
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({ title: "Error", description: errorMessage });
    },
  });

  return { loginMutation, registerMutation, logoutMutation };
};

export default useAuth;
