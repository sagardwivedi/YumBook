import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import type { ForgotPasswordData } from "~/client";
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

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

function ForgotPassword() {
  const { fpasswordMutation } = useAuth();

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordSchema), // Validate with Zod schema
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordData> = (data) => {
    fpasswordMutation.mutateAsync({ body: data });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            Enter your email address, and we’ll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We’ll send a reset link to this email.
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
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
