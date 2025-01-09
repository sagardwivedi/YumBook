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
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col justify-center items-center p-4">
      <div className="w-full flex items-center max-w-md mb-4">
        <Link to="/auth/login">
          <Button
            variant="ghost"
            className="text-orange-600 group hover:text-orange-700 hover:bg-orange-100"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform ease-linear" />
          </Button>
        </Link>

        <div className="flex items-center ml-16 space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-orange-600">
            YumBook
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-orange-800">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join YumBook and start sharing your recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="chef@example.com" />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="chefmaster123" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
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
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-orange-600 hover:underline">
              Log in
            </Link>
          </p>
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
