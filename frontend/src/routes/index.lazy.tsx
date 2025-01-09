import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Star, Utensils, Users } from "lucide-react";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">
                YumBook
              </span>
            </Link>
            <div className="space-x-4">
              <Link to="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-orange-800 leading-tight">
                Share Your Culinary Creations
              </h1>
              <p className="text-xl mb-8 text-orange-700">
                Connect with food lovers, share your recipes, and discover new
                dishes from around the world!
              </p>
              <div className="space-x-4">
                <Link to="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Join the Community
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Food collage"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-800">
              Why Choose YumBook?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ChefHat className="w-12 h-12 text-orange-500" />}
                title="Share Your Recipes"
                description="Upload your favorite recipes with step-by-step instructions and mouthwatering photos."
              />
              <FeatureCard
                icon={<Utensils className="w-12 h-12 text-orange-500" />}
                title="Discover New Dishes"
                description="Explore a vast collection of recipes from cuisines around the world."
              />
              <FeatureCard
                icon={<Users className="w-12 h-12 text-orange-500" />}
                title="Connect with Food Lovers"
                description="Follow other chefs, like and comment on recipes, and build your culinary network."
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-800">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard
                number={1}
                title="Create an Account"
                description="Sign up for free and set up your profile."
              />
              <StepCard
                number={2}
                title="Share Your Recipes"
                description="Upload your favorite recipes with photos and instructions."
              />
              <StepCard
                number={3}
                title="Explore & Interact"
                description="Discover new recipes and connect with other food lovers."
              />
              <StepCard
                number={4}
                title="Grow Your Following"
                description="Build your audience and become a YumBook star chef!"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-800">
              What Our Users Say
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah K."
                avatar="/placeholder.svg?height=100&width=100"
                quote="YumBook has transformed my cooking experience. I've discovered so many amazing recipes!"
              />
              <TestimonialCard
                name="Mike R."
                avatar="/placeholder.svg?height=100&width=100"
                quote="As a professional chef, I love sharing my creations and getting inspired by others on this platform."
              />
              <TestimonialCard
                name="Emily T."
                avatar="/placeholder.svg?height=100&width=100"
                quote="The community here is so supportive. I've improved my cooking skills thanks to the feedback from other users."
              />
            </div>
          </div>
        </section>

        <section className="bg-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Sharing?</h2>
            <p className="text-xl mb-8">
              Join our community of food enthusiasts today!
            </p>
            <Link to="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-100"
              >
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-orange-800 text-orange-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-2">YumBook</h3>
              <p>Connecting food lovers worldwide</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Quick Links</h3>
              <ul>
                <li>
                  <Link to=".">About Us</Link>
                </li>
                <li>
                  <Link to=".">Features</Link>
                </li>
                <li>
                  <Link to=".">Pricing</Link>
                </li>
                <li>
                  <Link to=".">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Legal</h3>
              <ul>
                <li>
                  <Link to=".">Terms of Service</Link>
                </li>
                <li>
                  <Link to=".">Privacy Policy</Link>
                </li>
                <li>
                  <Link to=".">Cookie Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Connect</h3>
              <div className="flex space-x-4">
                <Link to="." className="text-orange-100 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link to="." className="text-orange-100 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link to="." className="text-orange-100 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} YumBook. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-4">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: { number: number; title: string; description: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-4">
          <span className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {number}
          </span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({
  name,
  avatar,
  quote,
}: { name: string; avatar: string; quote: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <img
            src={avatar}
            alt={name}
            width={50}
            height={50}
            className="rounded-full mr-4"
          />
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <Star className="w-5 h-5 text-yellow-400 inline" />
            <Star className="w-5 h-5 text-yellow-400 inline" />
            <Star className="w-5 h-5 text-yellow-400 inline" />
            <Star className="w-5 h-5 text-yellow-400 inline" />
            <Star className="w-5 h-5 text-yellow-400 inline" />
          </div>
        </div>
        <CardDescription>"{quote}"</CardDescription>
      </CardContent>
    </Card>
  );
}
