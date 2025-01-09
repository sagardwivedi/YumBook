import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface StoryProps {
  id: number;
  username: string;
  avatarUrl: string;
}

const stories: StoryProps[] = [
  { id: 1, username: "john_doe", avatarUrl: "https://i.pravatar.cc/150?img=1" },
  {
    id: 2,
    username: "jane_smith",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    username: "bob_johnson",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    username: "alice_williams",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    username: "charlie_brown",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    username: "emma_davis",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
];

async function Story() {
  return (
    <div className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide">
      {stories.map(({ avatarUrl, username, id }) => (
        <div key={id} className="flex flex-col items-center">
          <Avatar className="size-16 border-2 border-orange-500 p-1 rounded-full">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs mt-1">{username}</span>
        </div>
      ))}
    </div>
  );
}

function StorySkeleton() {
  return (
    <div className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <div key={id} className="flex flex-col">
          <Skeleton className="rounded-full border-2 p-1 size-16" />
          <Skeleton className="w-full mt-1 h-2" />
        </div>
      ))}
    </div>
  );
}

export { Story, StorySkeleton };
