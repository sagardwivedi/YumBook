import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { BodyLoginLoginAccessToken } from "@/client";
import { zBodyLoginLoginAccessToken } from "@/client/zod.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth, { isLoggedIn } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/home" });
    }
  },
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation } = useAuth();

  const form = useForm<BodyLoginLoginAccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(zBodyLoginLoginAccessToken),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: BodyLoginLoginAccessToken) {
    console.log(JSON.stringify(values, null, 2));
    await loginMutation.mutateAsync({ body: values });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col justify-center items-center p-4">
      <div className="w-full flex items-center max-w-md mb-4">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-orange-600 group hover:text-orange-700 hover:bg-orange-100"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform ease-linear" />
          </Button>
        </Link>

        <div className="flex items-center ml-20 space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-orange-600">
            YumBook
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-orange-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your YumBook account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="chef@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size={form.formState.isSubmitting ? "icon" : "default"}
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-orange-600 hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            to="/auth/signup"
            className="text-sm text-orange-600 hover:underline"
          >
            Create an account
          </Link>
        </CardFooter>
      </Card>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} YumBook. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
