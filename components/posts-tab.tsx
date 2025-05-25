"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Post, UserProfile } from "@/hooks/use-profile"
import { Eye, Heart, MessageCircle, Share, Play, Verified, MoreHorizontal } from "lucide-react"

interface PostsTabProps {
  userPosts: Post[]
  userProfile: UserProfile
  avatarImage: string
  viewMode: string
  onOpenYouTube: (url: string, videoData?: any) => void
}

export function PostsTab({ userPosts, userProfile, avatarImage, viewMode, onOpenYouTube }: PostsTabProps) {
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

  if (userPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhum post ainda</h3>
        <p className="text-sm text-center">Quando você criar posts, eles aparecerão aqui.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[400px]">
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
        {userPosts.map((post) =>
          viewMode === "grid" ? (
            // Grid View
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 transform hover:scale-105 cursor-pointer"
              onClick={() => {
                if (post.type === "youtube" && post.youtubeUrl) {
                  onOpenYouTube(post.youtubeUrl, post)
                }
              }}
            >
              <div className="relative">
                <img
                  src={post.thumbnail || "/placeholder.svg?height=192&width=320"}
                  alt={post.content}
                  className="w-full object-cover h-48"
                />
                {(post.type === "youtube" || post.type === "video") && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                )}
                {post.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {post.duration}
                  </div>
                )}
                <Badge className={`absolute top-2 left-2 ${getCategoryColor(post.category)}`}>{post.category}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.author?.avatar || avatarImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{post.author?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{post.author?.name || userProfile.name}</span>
                    {post.author?.verified && <Verified className="w-3 h-3 text-blue-500" />}
                  </div>

                  <p className="text-sm text-gray-900 line-clamp-3 leading-relaxed">{post.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {post.stats.views !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(post.stats.views)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {formatNumber(post.stats.likes)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {formatNumber(post.stats.comments)}
                      </div>
                    </div>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // List View
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl bg-white transform hover:scale-[1.02]"
            >
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <Avatar className="w-12 h-12 ring-2 ring-gray-100">
                    <AvatarImage src={post.author?.avatar || avatarImage || "/placeholder.svg"} />
                    <AvatarFallback>{post.author?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{post.author?.name || userProfile.name}</span>
                      {post.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      <span className="text-gray-500 text-sm">{post.author?.username || userProfile.username}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 text-sm">{post.timestamp}</span>
                    </div>
                    <Badge className={`w-fit ${getCategoryColor(post.category)}`}>{post.category}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <p className="text-gray-900 leading-relaxed text-base">{post.content}</p>
                    </div>

                    {post.thumbnail && (
                      <div className="w-48 flex-shrink-0">
                        <div className="relative rounded-xl overflow-hidden shadow-md h-32 bg-gray-100">
                          {post.type === "youtube" ? (
                            <div className="relative h-full">
                              <img
                                src={post.thumbnail || "/placeholder.svg"}
                                alt="YouTube thumbnail"
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => post.youtubeUrl && onOpenYouTube(post.youtubeUrl, post)}
                              />
                              <div
                                className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
                                onClick={() => post.youtubeUrl && onOpenYouTube(post.youtubeUrl, post)}
                              >
                                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg">
                                  <Play className="w-5 h-5 text-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={post.thumbnail || "/placeholder.svg"}
                              alt="Post media"
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          )}
                          {post.duration && (
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {post.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mt-4">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(post.stats.likes)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(post.stats.comments)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        <Share className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{formatNumber(post.stats.shares)}</span>
                    </button>
                    {post.stats.views !== undefined && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="p-2 rounded-full">
                          <Eye className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{formatNumber(post.stats.views)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  )
}
