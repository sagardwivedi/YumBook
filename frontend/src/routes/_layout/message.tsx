import { createFileRoute } from "@tanstack/react-router";

import { Info, Phone, Send, Video } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"

export const Route = createFileRoute("/_layout/message")({
  component: DirectMessagePage,
});

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
}

interface Conversation {
  id: number
  name: string
  lastMessage: string
  avatar: string
  isActive: boolean
  messages: Message[]
}

export default function DirectMessagePage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      avatar: 'JD',
      isActive: true,
      messages: [
        { id: 1, sender: 'John', content: 'Hey, how are you?', timestamp: '10:00 AM' },
        { id: 2, sender: 'You', content: 'I\'m good, thanks! How about you?', timestamp: '10:05 AM' },
        { id: 3, sender: 'John', content: 'Doing great! Any plans for the weekend?', timestamp: '10:10 AM' },
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastMessage: 'See you tomorrow!',
      avatar: 'JS',
      isActive: false,
      messages: [
        { id: 1, sender: 'Jane', content: 'Hi there!', timestamp: '9:30 AM' },
        { id: 2, sender: 'You', content: 'Hello Jane!', timestamp: '9:35 AM' },
        { id: 3, sender: 'Jane', content: 'See you tomorrow!', timestamp: '9:40 AM' },
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      lastMessage: 'Thanks for the help!',
      avatar: 'MJ',
      isActive: false,
      messages: [
        { id: 1, sender: 'Mike', content: 'Can you help me with something?', timestamp: '2:00 PM' },
        { id: 2, sender: 'You', content: 'Sure, what do you need?', timestamp: '2:05 PM' },
        { id: 3, sender: 'Mike', content: 'Thanks for the help!', timestamp: '2:30 PM' },
      ]
    },
  ])

  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg: Message = {
        id: activeConversation.messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, messages: [...conv.messages, newMsg], lastMessage: newMsg.content }
            : conv
        )
      )
      setActiveConversation(prevConv => ({ ...prevConv, messages: [...prevConv.messages, newMsg] }))
      setNewMessage('')
    }
  }

  const handleConversationClick = (id: number) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        ({ ...conv, isActive: conv.id === id })
      )
    )
    setActiveConversation(conversations.find(conv => conv.id === id) || conversations[0])
  }

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-100">
        <ScrollArea className="h-full">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                conversation.isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.avatar}`} />
                <AvatarFallback>{conversation.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h2>
                <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${activeConversation.avatar}`} />
            <AvatarFallback>{activeConversation.avatar}</AvatarFallback>
          </Avatar>
          <h2 className="text-sm font-medium">{activeConversation.name}</h2>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {activeConversation.messages.map((message) => (
            <div key={message.id} className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : ''}`}>
              <div className={`rounded-lg p-3 max-w-[70%] ${
                message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-75 mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-100">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button type="submit" size="icon" className="rounded-full">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
