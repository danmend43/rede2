"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserProfile } from "@/hooks/use-profile"
import { X, Youtube, ThumbsUp, ThumbsDown, Share, Eye, Verified, MessageCircle, Heart } from "lucide-react"

interface YouTubeModalProps {
  url: string
  videoData?: any
  userProfile: UserProfile
  avatarImage: string
  onClose: () => void
}

export function YouTubeModal({ url, videoData, userProfile, avatarImage, onClose }: YouTubeModalProps) {
  const [newComment, setNewComment] = useState("")
  const [videoComments, setVideoComments] = useState<any[]>([])

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toLocaleString()
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: videoComments.length + 1,
      user: userProfile.name,
      avatar: avatarImage,
      comment: newComment,
      timestamp: "agora",
      likes: 0,
    }

    setVideoComments([comment, ...videoComments])
    setNewComment("")
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-7xl w-full max-h-[90vh] flex">
        {/* Video Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" />
              Reproduzindo vídeo
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(url) || ""}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Sidebar - Video Info + Comments */}
        <div className="w-96 border-l border-gray-200 flex flex-col bg-gray-50">
          {/* Video Info */}
          {videoData && (
            <div className="bg-white border-b border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={videoData.author?.avatar || avatarImage || "/placeholder.svg"} />
                  <AvatarFallback>{videoData.author?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {videoData.author?.name || userProfile.name}
                    </span>
                    {videoData.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-xs text-gray-600">{videoData.timestamp}</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{videoData.content}</p>

              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatNumber(videoData.stats.likes)}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <Share className="w-4 h-4" />
                  <span className="text-xs">Compartilhar</span>
                </button>
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">{formatNumber(videoData.stats.views || 0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Comments Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              Comentários
            </h4>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-4">
              {videoComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{comment.user}</span>
                      <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{comment.likes}</span>
                      </button>
                      <button className="text-gray-500 hover:text-blue-500 transition-colors text-xs">Responder</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={avatarImage || "/placeholder.svg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{newComment.length}/500</span>
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Comentar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
