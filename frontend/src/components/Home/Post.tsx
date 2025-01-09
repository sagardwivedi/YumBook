import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { ResponsiveModal } from "./PostDrawerDialog";
import { Link } from "@tanstack/react-router";

interface PostProps {
  id: string;
  username: string;
  avatarUrl: string;
  imageUrl: string[] | string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const posts: PostProps[] = [
  {
    id: "1",
    username: "foodie_chef",
    avatarUrl: "https://i.pravatar.cc/200?img=7",
    imageUrl: "https://picsum.photos/800/600?random=1",
    caption: "Delicious Pancakes! 🥞 Recipe is easy and quick.",
    likes: 120,
    comments: 10,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    username: "travel_enthusiast",
    avatarUrl: "https://i.pravatar.cc/200?img=8",
    imageUrl: "https://picsum.photos/800/600?random=2",
    caption: "Exploring new horizons! ✈️🌎 #wanderlust",
    likes: 250,
    comments: 15,
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    username: "fitness_guru",
    avatarUrl: "https://i.pravatar.cc/200?img=9",
    imageUrl: [
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4",
      "https://picsum.photos/800/600?random=5",
    ],
    caption: "Morning workout done! 💪 Stay motivated!",
    likes: 180,
    comments: 8,
    timestamp: "1 day ago",
  },
];

export function Post() {
  return (
    <div className="space-y-6 divide-y">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: PostProps }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Set the initial count and current image index
    setCurrent(api.selectedScrollSnap());

    // Listen for changes in the selected image index
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    // Cleanup the event listener
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Avatar className="h-10 w-10 overflow-hidden">
          <AvatarImage
            className="bg-cover"
            src={post.avatarUrl}
            alt={`${post.username}'s avatar`}
          />
          <AvatarFallback>{post.username[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <Link
            to="/$profile"
            params={{ profile: post.username }}
            className="hover:underline"
          >
            <h4 className="font-bold text-gray-800">{post.username}</h4>
          </Link>
          <Link
            to="/p/$postId"
            params={{ postId: post.id }}
            className="hover:underline"
          >
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </Link>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        {Array.isArray(post.imageUrl) ? (
          <Carousel
            setApi={setApi}
            orientation="horizontal"
            className="relative"
          >
            <CarouselContent>
              {post.imageUrl.map((image) => (
                <CarouselItem key={image}>
                  <img
                    src={image}
                    alt="User's post"
                    className="rounded-lg w-full aspect-square"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="absolute right-2" />
            <CarouselPrevious className="absolute left-2" />
            <div className="flex space-x-2 absolute bottom-2 left-1/2 transform -translate-x-1/2">
              {post.imageUrl.map((_, index) => {
                const isCurrent = current === index;
                const isPrev = current - 1 === index;
                const isNext = current + 1 === index;
                const showPills = Math.abs(current - index) <= 1; // Only show the three pills around the current one

                return (
                  showPills && (
                    <span
                      className={`rounded-full block size-2 transition-all duration-300 ease-in-out ${
                        isCurrent
                          ? "bg-orange-500 scale-125" // Center pill gets larger
                          : isPrev || isNext
                            ? "bg-gray-300 opacity-75" // Fade adjacent pills
                            : "opacity-0" // Hide other pills
                      }`}
                    />
                  )
                );
              })}
            </div>
          </Carousel>
        ) : (
          <img
            src={post.imageUrl}
            alt="User's post"
            className="rounded-lg w-full aspect-square"
          />
        )}

        {/* ResponsiveModal Trigger */}
        <ResponsiveModal
          trigger={
            <Button
              className="absolute bottom-4 right-4 bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-full shadow-lg"
              aria-label="Show Post Details"
            >
              Details
            </Button>
          }
          title={`${post.username}'s Post`}
          description="Explore more details, comments, likes, or recipes."
        >
          <div className="space-y-4">
            <p className="text-gray-800">{post.caption}</p>
            <div>
              <h4 className="font-bold text-gray-800">Likes:</h4>
              <p>{post.likes + (post.likes ? 1 : 0)}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Comments:</h4>
              <p>{post.comments}</p>
            </div>
          </div>
        </ResponsiveModal>
      </div>

      {/* Caption */}
      <p className="text-gray-800 mt-4">{post.caption}</p>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          {/* Like Button */}
          <Button
            variant={"ghost"}
            className="flex items-center space-x-1"
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Like post"
          >
            <Heart
              className={`w-8 h-8 ${isLiked ? "text-red-500 fill-current" : "text-gray-600"}`}
            />
          </Button>

          {/* Comment Button */}
          <Button
            variant={"ghost"}
            className="flex items-center space-x-1"
            aria-label="View comments"
          >
            <MessageCircle className="w-6 h-6 text-gray-600 hover:text-orange-500" />
          </Button>

          {/* Share Button */}
          <Button variant={"ghost"} aria-label="Share post">
            <Send className="w-6 h-6 text-gray-600 hover:text-orange-500" />
          </Button>
        </div>

        {/* Save Button */}
        <Button
          variant={"ghost"}
          onClick={() => setIsSaved(!isSaved)}
          aria-label="Save post"
        >
          <Bookmark
            className={`w-6 h-6 ${isSaved ? "text-orange-500 fill-current" : "text-gray-600"}`}
          />
        </Button>
      </div>
    </div>
  );
}
