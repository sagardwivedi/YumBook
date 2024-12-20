import { Loader, Lock, Mail } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { Body_auth_login_user as LoginData } from "~/client";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import useAuth from "~/hooks/use-auth";
const LoginComponent = () => {
  const { loginMutation } = useAuth();

  const form = useForm<LoginData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<LoginData> = (data) =>
    loginMutation.mutateAsync({ body: data });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            rules={{
              required: {
                value: true,
                message: "Please enter your email",
              },
            }}
            render={({ field }) => (
              <div className="space-y-2">
                <FormItem>
                  <FormLabel htmlFor="email" className="text-sm font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        autoComplete="email"
                        {...field}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: {
                value: true,
                message: "Please enter your password",
              },
            }}
            render={({ field }) => (
              <div className="space-y-2">
                <FormItem>
                  <FormLabel htmlFor="password" className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginComponent;
