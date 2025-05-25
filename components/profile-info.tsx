"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserProfile } from "@/hooks/use-profile"
import {
  UserPlus,
  MessageCircle,
  Share,
  MoreHorizontal,
  Verified,
  Crown,
  Trophy,
  MapPin,
  LinkIcon,
  Calendar,
} from "lucide-react"

interface ProfileInfoProps {
  userProfile: UserProfile
  avatarImage: string
  onAvatarClick: () => void
}

export function ProfileInfo({ userProfile, avatarImage, onAvatarClick }: ProfileInfoProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toLocaleString()
  }

  return (
    <div className="flex-1">
      <div className="flex items-end gap-6 -mt-16 mb-6">
        {/* Avatar with Frame */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
            <Avatar className="w-full h-full border-4 border-white cursor-pointer" onClick={onAvatarClick}>
              <AvatarImage src={avatarImage || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Seguir
          </Button>
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Mensagem
          </Button>
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
            {userProfile.verified && <Verified className="w-6 h-6 text-blue-500" />}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-md">
                <Crown className="w-4 h-4" />
                Nível {userProfile.level}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold shadow-md">
                <Trophy className="w-3 h-3" />
                #127
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-3">{userProfile.username}</p>
        </div>

        <div className="whitespace-pre-line text-gray-900 leading-relaxed">{userProfile.bio}</div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {userProfile.location}
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="text-blue-600 hover:underline">
              {userProfile.website}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Ingressou em {userProfile.joinDate}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 py-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatNumber(userProfile.stats.followers)}</div>
            <div className="text-sm text-gray-600">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatNumber(userProfile.stats.following)}</div>
            <div className="text-sm text-gray-600">Seguindo</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatNumber(userProfile.stats.posts)}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatNumber(userProfile.stats.likes)}</div>
            <div className="text-sm text-gray-600">Curtidas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
