import { Link } from "@tanstack/react-router";
import { Frown } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-100 text-gray-800">
      <Frown className="text-6xl mb-6 text-gray-600" />
      <p className="text-8xl font-bold mb-4">404</p>
      <p className="text-2xl font-semibold mb-2">Oops!</p>
      <p className="text-lg mb-6">Page not found.</p>
      <Button asChild variant={"outline"}>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
