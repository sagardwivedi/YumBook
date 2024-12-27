import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/hooks/use-toast";

export const Route = createFileRoute("/_layout/accounts/edit")({
  component: EditProfilePage,
});



interface UserProfile {
  name: string
  username: string
  email: string
  bio: string
  avatar: string
  privateAccount: boolean
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    bio: "Hello, I'm John! I love photography and travel.",
    avatar: 'JD',
    privateAccount: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setProfile(prev => ({ ...prev, privateAccount: checked }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload the file to your server here
      // For now, we'll just update the avatar with the file name
      setProfile(prev => ({ ...prev, avatar: file.name }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.avatar}`} />
            <AvatarFallback>{profile.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600">
                <Upload size={16} />
                <span>Change Photo</span>
              </div>
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="privateAccount" className="text-sm font-medium">
            Private Account
          </Label>
          <Switch
            id="privateAccount"
            checked={profile.privateAccount}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </div>
  )
}

