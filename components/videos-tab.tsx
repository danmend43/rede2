"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DouyinVideoModal } from "./douyin-video-modal"
import type { Post, UserProfile } from "@/hooks/use-profile"
import { Eye, Heart, MessageCircle, Share, Play, Verified, MoreHorizontal } from "lucide-react"

interface VideosTabProps {
  userVideos: Post[]
  userProfile: UserProfile
  avatarImage: string
  viewMode: string
}

export function VideosTab({ userVideos, userProfile, avatarImage, viewMode }: VideosTabProps) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toLocaleString()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Anime: "text-pink-600 bg-pink-50",
      Tecnologia: "text-blue-600 bg-blue-50",
      Jogos: "text-purple-600 bg-purple-50",
      Culinária: "text-yellow-600 bg-yellow-50",
      Pessoal: "text-green-600 bg-green-50",
      Música: "text-orange-600 bg-orange-50",
      Arte: "text-indigo-600 bg-indigo-50",
    }
    return colors[category] || "text-gray-600 bg-gray-50"
  }

  const handleVideoClick = (index: number) => {
    setCurrentVideoIndex(index)
    setShowVideoModal(true)
  }

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index)
  }

  if (userVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Play className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhum vídeo ainda</h3>
        <p className="text-sm text-center">
          Faça upload de vídeos locais para vê-los aqui. Vídeos do YouTube aparecem na aba "Posts".
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[400px]">
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
        {userVideos.map((video, index) =>
          viewMode === "grid" ? (
            // Grid View
            <Card
              key={video.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 transform hover:scale-105 cursor-pointer"
              onClick={() => handleVideoClick(index)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg?height=192&width=320"}
                  alt={video.content}
                  className="w-full object-cover h-48"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                )}
                <Badge className={`absolute top-2 left-2 ${getCategoryColor(video.category)}`}>{video.category}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={video.author?.avatar || avatarImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{video.author?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{video.author?.name || userProfile.name}</span>
                    {video.author?.verified && <Verified className="w-3 h-3 text-blue-500" />}
                  </div>

                  <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">{video.content}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{formatNumber(video.stats.views || 0)} views</span>
                      <span>{formatNumber(video.stats.likes)} likes</span>
                    </div>
                    <span>{video.timestamp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // List View
            <Card
              key={video.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl bg-white transform hover:scale-[1.02] cursor-pointer"
              onClick={() => handleVideoClick(index)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <Avatar className="w-12 h-12 ring-2 ring-gray-100">
                    <AvatarImage src={video.author?.avatar || avatarImage || "/placeholder.svg"} />
                    <AvatarFallback>{video.author?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{video.author?.name || userProfile.name}</span>
                      {video.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      <span className="text-gray-500 text-sm">{video.author?.username || userProfile.username}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 text-sm">{video.timestamp}</span>
                    </div>
                    <Badge className={`w-fit ${getCategoryColor(video.category)}`}>{video.category}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <p className="text-gray-900 leading-relaxed text-base">{video.content}</p>
                    </div>

                    <div className="w-48 flex-shrink-0">
                      <div className="relative rounded-xl overflow-hidden shadow-md h-32 bg-gray-100">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                            <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mt-4">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(video.stats.likes)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(video.stats.comments)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        <Share className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(video.stats.shares)}</span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="p-2 rounded-full">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(video.stats.views || 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* Douyin Video Modal */}
      {showVideoModal && (
        <DouyinVideoModal
          videos={userVideos}
          currentIndex={currentVideoIndex}
          userProfile={userProfile}
          avatarImage={avatarImage}
          onClose={() => setShowVideoModal(false)}
          onVideoChange={handleVideoChange}
        />
      )}
    </div>
  )
}
