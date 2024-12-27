import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";

export const Route = createFileRoute("/_layout/activity")({
  component: NotificationPage,
});


interface Notification {
  id: number
  type: 'like' | 'comment' | 'follow'
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      user: { name: 'John Doe', avatar: 'JD' },
      content: 'liked your post.',
      timestamp: '2h ago'
    },
    {
      id: 2,
      type: 'comment',
      user: { name: 'Jane Smith', avatar: 'JS' },
      content: 'commented on your photo: "Great shot!"',
      timestamp: '4h ago'
    },
    {
      id: 3,
      type: 'follow',
      user: { name: 'Mike Johnson', avatar: 'MJ' },
      content: 'started following you.',
      timestamp: '1d ago'
    },
    {
      id: 4,
      type: 'like',
      user: { name: 'Emily Brown', avatar: 'EB' },
      content: 'liked your comment.',
      timestamp: '2d ago'
    },
    {
      id: 5,
      type: 'comment',
      user: { name: 'Alex Wilson', avatar: 'AW' },
      content: 'replied to your comment: "Thanks!"',
      timestamp: '3d ago'
    }
  ])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ScrollArea className="flex-grow">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${notification.user.avatar}`} />
              <AvatarFallback>{notification.user.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <p className="text-sm">
                <span className="font-medium">{notification.user.name}</span>{' '}
                {notification.content}
              </p>
              <p className="text-xs text-gray-500">{notification.timestamp}</p>
            </div>
            <div className="ml-3">
              {getNotificationIcon(notification.type)}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}