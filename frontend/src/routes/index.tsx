import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import LoginComponent from "~/components/auth/Login";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { isAuthenticated } from "~/hooks/use-auth";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const is = await isAuthenticated();
    if (is) {
      throw redirect({ to: "/home" });
    }
  },
  component: Home,
});

const IMAGE_CAROSOUL = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/1860208/pexels-photo-1860208.jpeg?cs=srgb&dl=cooked-food-1860208.jpg&fm=jpg",
  },
  {
    id: 2,
    src: "http://images6.fanpop.com/image/photos/36100000/Food-image-food-36147866-6668-4992.jpg",
  },
  {
    id: 3,
    src: "http://topreviewtracking.com/wp-content/uploads/2015/04/Dollarphotoclub_61600915.jpg",
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = IMAGE_CAROSOUL.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - App info and image carousel */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-10 text-white flex-col justify-center items-start space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">YumBook</h1>
        <p className="text-xl mb-8">
          Share your culinary creations with food lovers around the world.
        </p>

        {/* Image Carousel */}
        <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-xl shadow-lg">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </Button>
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {IMAGE_CAROSOUL.map((img) => (
              <img
                key={img.id}
                src={img.src}
                alt={`Recipe ${img.id + 1}`}
                className="w-full h-[450px] object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Authentication form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              Welcome to YumBook
            </h2>
            <p className="text-gray-600 mt-2">
              Log in to share your culinary creations
            </p>
          </div>
          <LoginComponent />
          <div className="mt-4 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Separator className="my-8" />

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
