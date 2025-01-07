import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ChefHat } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col justify-center items-center p-4">
      <div className="w-full flex items-center max-w-md mb-4">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center ml-16 space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-orange-600">
            RecipeSocial
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-orange-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your RecipeSocial account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="chef@example.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Sign In
              </Button>
            </div>
          </form>
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
    </div>
  );
}
