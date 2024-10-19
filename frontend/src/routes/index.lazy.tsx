import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import LoginComponent from "~/components/auth/Login";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const Route = createLazyFileRoute("/")({
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
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - App info and image carousel (hidden on small screens) */}
      <div className="hidden md:w-1/2 md:flex bg-primary p-8 text-white flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">YumBook</h1>
        <p className="text-xl mb-8">
          Share your culinary creations with food lovers around the world.
        </p>

        {/* Image Carousel */}
        <div className="relative w-full max-w-md mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="overflow-hidden rounded-lg shadow-xl">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {IMAGE_CAROSOUL.map((img) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt={`Recipe ${img.id + 1}`}
                  className="w-full h-[400px] object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Authentication form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
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
