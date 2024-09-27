import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Share2, Users, Utensils } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const Route = createLazyFileRoute("/")({
  component: LandingPage,
});

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen dark:text-primary bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-16 flex items-center fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center" href="/">
          <Utensils className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-foreground">
            YumBook
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-primary"
            to="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary"
            to="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary"
            to="#testimonials"
          >
            Testimonials
          </Link>
        </nav>
      </header>
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in-up">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Share Your Culinary Creations with{" "}
                  <span className="text-primary">YumBook</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover, create, and share delicious recipes with food
                  enthusiasts around the world.
                </p>
              </div>
              <div className="space-x-4 animate-fade-in">
                <Button
                  size="lg"
                  className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                  asChild
                >
                  <Link to={"/auth/login"}>Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-16 flex justify-center animate-bounce">
            <ChevronDown className="h-8 w-8 text-primary" />
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 animate-fade-in-up">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Recipe Library</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Access thousands of recipes from around the world.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <Share2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Share your recipes with friends and family effortlessly.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Connect with other food lovers and get inspired.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 animate-fade-in-up">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="transition-all duration-300 ease-in-out hover:scale-105">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  width={400}
                  height={400}
                  alt="YumBook app screenshot"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">1. Create Your Account</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Sign up for free and set up your profile.
                </p>
                <h3 className="text-2xl font-bold">2. Explore Recipes</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse through our extensive collection of recipes.
                </p>
                <h3 className="text-2xl font-bold">3. Share Your Creations</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your own recipes and share them with the community.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 animate-fade-in-up">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  "YumBook has revolutionized the way I cook. I've discovered so
                  many amazing recipes!"
                </p>
                <p className="font-bold">- Sarah J.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  "As a professional chef, I love sharing my creations on
                  YumBook. The community is fantastic!"
                </p>
                <p className="font-bold">- Chef Michael</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  "YumBook has made meal planning so much easier. I can't
                  imagine cooking without it now."
                </p>
                <p className="font-bold">- Emma T.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in-up">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Join YumBook Today
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start your culinary journey and connect with food lovers
                  around the world.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 animate-fade-in">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-primary-foreground text-primary"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                  >
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-primary-foreground/80">
                  By signing up, you agree to our{" "}
                  <Link
                    className="underline underline-offset-2 hover:text-primary-foreground transition-colors duration-200 ease-in-out"
                    href="#"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 YumBook. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 transition-colors duration-200 ease-in-out"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 transition-colors duration-200 ease-in-out"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
