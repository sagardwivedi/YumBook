import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getCurrentUser } from "~/client";
import {
  forgotPasswordMutation,
  loginUserMutation,
  logoutUserMutation,
  registerUserMutation,
  resetPasswordMutation,
} from "~/client/@tanstack/react-query.gen";
import { getErrorMessage } from "~/lib/utils";
import { useToast } from "./use-toast";

export const isAuthenticated = async () => {
  try {
    const { data } = await getCurrentUser();
    return !!data;
  } catch (error) {
    console.log("Error:", error);
  }
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

  const fpasswordMutation = useMutation({
    ...forgotPasswordMutation(),
    onSuccess: (data) => {
      navigate({
        to: "/auth/reset-password",
        search: { reset_token: data.data.reset_token as string },
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({ title: "Error", description: errorMessage });
    },
  });

  const rpasswordMutation = useMutation({
    ...resetPasswordMutation(),
    onSuccess: (data) => {
      toast({ title: "Success", description: data.detail });
      navigate({
        to: "/",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast({ title: "Error", description: errorMessage });
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    fpasswordMutation,
    rpasswordMutation,
  };
};

export default useAuth;
