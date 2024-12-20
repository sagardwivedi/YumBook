import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import useAuth from "~/hooks/use-auth";

const passwordSearchSchema = z.object({
  reset_token: z.string(),
});

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: passwordSearchSchema,
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordPage() {
  const { rpasswordMutation } = useAuth();

  const { reset_token } = Route.useSearch();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    defaultValues: { confirmPassword: "", password: "" },
  });

  const onSubmit: SubmitHandler<z.infer<typeof resetPasswordSchema>> = (data) =>
    rpasswordMutation.mutateAsync({
      body: { new_password: data.password, token: reset_token },
    });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            Enter your new password below to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a strong password (at least 8 characters, with a
                      mix of letters and numbers).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Re-enter the same password to confirm.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="mt-4 w-full"
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin size-5" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
