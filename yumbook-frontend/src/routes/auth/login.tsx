import { Link, createFileRoute, redirect } from '@tanstack/react-router';
import { Lock, Mail, Utensils } from 'lucide-react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import type { Body_auth_login_user as LoginData } from '~/client';
import { Button } from '~/components/ui/button';
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
import { Input } from '~/components/ui/input';
import useAuth, { isAuthenticated } from '~/hooks/use-auth';

export const Route = createFileRoute('/auth/login')({
  beforeLoad: async () => {
    const success = await isAuthenticated();
    if (success) {
      throw redirect({
        to: '/home',
      });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { loginMutation } = useAuth();

  const form = useForm<LoginData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin: SubmitHandler<LoginData> = (data) =>
    loginMutation.mutate({ body: data });

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
            Share your culinary masterpieces
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                rules={{
                  required: {
                    value: true,
                    message: 'Please enter your email',
                  },
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormItem>
                      <FormLabel
                        htmlFor="email"
                        className="text-sm font-medium"
                      >
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
                    message: 'Please enter your password',
                  },
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormItem>
                      <FormLabel
                        htmlFor="password"
                        className="text-sm font-medium"
                      >
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
              >
                Log in to YumBook
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <Link
            to={'/auth/forgot-password'}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-muted-foreground">
            New to YumBook?{' '}
            <Link
              to={'/auth/signup'}
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Create an account
            </Link>
          </div>
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
