import { loginAccessTokenMutation } from "@/client/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "./use-toast";

export const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null;
};

export default function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginMutation = useMutation({
    ...loginAccessTokenMutation(),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.accessToken);
      navigate({ to: "/home" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something wrong",
        description: error.detail?.toLocaleString(),
      });
    },
  });

  return { loginMutation };
}
