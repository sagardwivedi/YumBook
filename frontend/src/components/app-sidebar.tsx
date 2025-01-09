import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Bookmark, ChefHat, Home, PlusIcon, Search, User } from "lucide-react";
import { useState } from "react";
import { ResponsiveModal } from "./Home/PostDrawerDialog";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Input } from "./ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

// User data
const user = {
  username: "Jane_Doe",
  email: "jane.doe@example.com",
  avatar: "https://via.placeholder.com/150",
};

// Menu options with dynamic route for profile
const menuOptions = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/explorer", label: "Explore", icon: Search },
  { to: "/saved", label: "Saved Posts", icon: Bookmark },
  {
    to: `/${user.username}`,
    label: "Profile",
    icon: User,
  }, // Dynamic profile link
];

export function AppSideBar() {
  const location = useLocation();

  return (
    <Sidebar>
      {/* Header Section */}
      <SidebarHeader className="py-4 px-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex aspect-square w-12 items-center justify-center rounded-full bg-orange-500">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-orange-600 hidden lg:block">
            YumBook
          </span>
        </div>
      </SidebarHeader>
      {/* Main Menu */}
      <SidebarContent>
        <SidebarMenu>
          {menuOptions.map((item) => (
            <SidebarMenuItem className="px-4" key={item.label}>
              <SidebarMenuButton tooltip={item.label} asChild>
                <Link
                  to={item.to}
                  className={"flex items-center space-x-3 p-5 text-2xl"}
                  aria-current={
                    location.pathname === item.to ? "page" : undefined
                  }
                >
                  <item.icon className="" />
                  <span
                    className={cn(
                      "hidden lg:inline text-xl font-medium",
                      location.pathname === item.to ? "font-bold" : "",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="px-4">
          <SidebarMenuButton asChild>
            <RecipePost
              trigger={
                <Button
                  variant={"ghost"}
                  className="text-xl justify-start space-x-4 flex w-full"
                >
                  <PlusIcon />
                  <span>Create</span>
                </Button>
              }
            />
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

const RecipePost = ({ trigger }: { trigger: React.ReactNode }) => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!recipeName || !ingredients || !instructions || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    console.log("Recipe Submitted", {
      recipeName,
      ingredients,
      instructions,
      image,
    });
  };

  return (
    <ResponsiveModal trigger={trigger} className="max-w-3xl mx-auto">
      <div className="space-y-6 max-h-[80vh] px-4 py-6">
        {/* Carousel Steps for Recipe Creation */}
        <Carousel
          orientation="horizontal"
          className="relative transition-all ease-in-out"
        >
          <CarouselContent>
            {/* Step 1: Image Selection */}
            <CarouselItem>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Step 1: Select an Image
              </h2>
              <div className="space-y-4">
                <label
                  htmlFor="recipe-image"
                  className="block text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Upload Recipe Image
                </label>
                <Input
                  id="recipe-image"
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {image && (
                  <div className="mt-2 text-sm text-gray-500">
                    Image selected: {image.name}
                  </div>
                )}
              </div>
            </CarouselItem>

            {/* Step 2: Recipe Details */}
            <CarouselItem>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Step 2: Recipe Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="recipe-name"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Recipe Name
                  </label>
                  <Input
                    id="recipe-name"
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipe name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ingredients"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Ingredients
                  </label>
                  <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List ingredients"
                  />
                </div>

                <div>
                  <label
                    htmlFor="instructions"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide cooking instructions"
                  />
                </div>
              </div>
            </CarouselItem>

            {/* Step 3: Recipe Overview */}
            <CarouselItem>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Step 3: Recipe Overview
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800">Image Preview:</h3>
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="rounded-lg w-full aspect-square mb-4"
                    />
                  ) : (
                    <div className="text-gray-500">No image selected</div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">Recipe Name:</h4>
                  <p>{recipeName || "Not Provided"}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">Ingredients:</h4>
                  <p>{ingredients || "Not Provided"}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">Instructions:</h4>
                  <p>{instructions || "Not Provided"}</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Submit Recipe
                </Button>
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Carousel Controls */}
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
    </ResponsiveModal>
  );
};
