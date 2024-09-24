import { createFileRoute, Link } from '@tanstack/react-router';
('lucide-react');
import { type SubmitHandler, useForm } from 'react-hook-form';

import useAuth from '~/hooks/use-auth';
import type { UserCreate } from '~/client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Utensils, Mail, Lock, User } from 'lucide-react';

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  const { registerMutation } = useAuth();

  const form = useForm<UserCreate>({
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const handleSignup: SubmitHandler<UserCreate> = (data) => {
    registerMutation.mutate({ body: data });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <CardHeader className="text-center space-y-1 pt-8">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Utensils className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">YumBook</h1>
          </div>
          <p className="text-muted-foreground italic">
            Join the culinary community
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="chefmaster123"
                            className="pl-10"
                            {...field}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
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
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
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
              >
                Create YumBook Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to={'/auth/login'}
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Log in
            </Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="relative group">
          <img
            src="/placeholder.svg?height=120&width=120"
            alt="Recipe 1"
            className="w-28 h-28 rounded-lg object-cover shadow-md transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg flex items-center justify-center">
            <Utensils className="text-primary-foreground w-8 h-8" />
          </div>
        </div>
        <div className="relative group">
          <img
            src="/placeholder.svg?height=120&width=120"
            alt="Recipe 2"
            className="w-28 h-28 rounded-lg object-cover shadow-md transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg flex items-center justify-center">
            <Utensils className="text-primary-foreground w-8 h-8" />
          </div>
        </div>
        <div className="relative group">
          <img
            src="/placeholder.svg?height=120&width=120"
            alt="Recipe 3"
            className="w-28 h-28 rounded-lg object-cover shadow-md transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg flex items-center justify-center">
            <Utensils className="text-primary-foreground w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
