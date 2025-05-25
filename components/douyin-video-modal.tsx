"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useVideoPlayer } from "@/hooks/use-video-player"
import type { Post, UserProfile } from "@/hooks/use-profile"
import { formatDuration } from "@/lib/video-utils"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  AlertCircle,
  Send,
  Bookmark,
  Download,
  Smile,
  Gift,
  Crown,
  Verified,
  Eye,
} from "lucide-react"

interface DouyinVideoModalProps {
  videos: Post[]
  currentIndex: number
  userProfile: UserProfile
  avatarImage: string
  onClose: () => void
  onVideoChange: (index: number) => void
}

export function DouyinVideoModal({
  videos,
  currentIndex,
  userProfile,
  avatarImage,
  onClose,
  onVideoChange,
}: DouyinVideoModalProps) {
  const [showComments, setShowComments] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [viewCount, setViewCount] = useState(12547)

  const backgroundVideoRef = useRef<HTMLVideoElement>(null)

  const {
    videoRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    loadVideo,
    togglePlay,
    seek,
    setVolumeLevel,
  } = useVideoPlayer()

  const currentVideo = videos[currentIndex]

  useEffect(() => {
    if (currentVideo?.videoUrl) {
      loadVideo(currentVideo.videoUrl)

      // Carregar vídeo de fundo também
      if (backgroundVideoRef.current) {
        backgroundVideoRef.current.src = currentVideo.videoUrl
        backgroundVideoRef.current.load()
      }

      // Auto-play quando o vídeo carregar
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error)
        }
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.play().catch(console.error)
        }
      }, 100)
    }
  }, [currentVideo?.videoUrl, loadVideo])

  // Sincronizar vídeo de fundo com o principal
  useEffect(() => {
    const mainVideo = videoRef.current
    const bgVideo = backgroundVideoRef.current

    if (!mainVideo || !bgVideo) return

    const syncVideos = () => {
      if (Math.abs(mainVideo.currentTime - bgVideo.currentTime) > 0.3) {
        bgVideo.currentTime = mainVideo.currentTime
      }
    }

    const handlePlay = () => bgVideo.play().catch(console.error)
    const handlePause = () => bgVideo.pause()
    const handleSeeked = () => {
      bgVideo.currentTime = mainVideo.currentTime
    }

    mainVideo.addEventListener("play", handlePlay)
    mainVideo.addEventListener("pause", handlePause)
    mainVideo.addEventListener("seeked", handleSeeked)
    mainVideo.addEventListener("timeupdate", syncVideos)

    return () => {
      mainVideo.removeEventListener("play", handlePlay)
      mainVideo.removeEventListener("pause", handlePause)
      mainVideo.removeEventListener("seeked", handleSeeked)
      mainVideo.removeEventListener("timeupdate", syncVideos)
    }
  }, [currentVideo?.videoUrl])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls, isPlaying])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      user: userProfile.name,
      avatar: avatarImage,
      comment: newComment,
      timestamp: "agora",
      likes: Math.floor(Math.random() * 50),
      isVerified: Math.random() > 0.7,
      isVip: Math.random() > 0.8,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onVideoChange(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      onVideoChange(currentIndex + 1)
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleVideoClick = () => {
    setShowControls(true)
    if (!isLoading && !error) {
      togglePlay()
    }
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // Animate heart
    const heartElement = document.querySelector(".heart-animation")
    if (heartElement) {
      heartElement.classList.add("animate-bounce")
      setTimeout(() => heartElement.classList.remove("animate-bounce"), 500)
    }
  }

  if (!currentVideo) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Left Panel - Video Player */}
      <div
        className={`relative flex flex-col transition-all duration-500 ease-in-out ${showComments ? "w-[calc(100vw-384px)]" : "w-full"}`}
      >
        {/* Header with Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-20">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full p-3 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrevious}
              className="w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
            >
              <ChevronUp className="w-7 h-7" />
            </Button>
          )}

          {currentIndex < videos.length - 1 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={handleNext}
              className="w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
            >
              <ChevronDown className="w-7 h-7" />
            </Button>
          )}
        </div>

        {/* Video Container */}
        <div
          className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${showComments ? "mr-16" : "mr-0"}`}
          onMouseMove={handleMouseMove}
          style={{ zIndex: 10 }}
        >
          {/* Background Video with Blur */}
          <video
            ref={backgroundVideoRef}
            className="fixed inset-0 w-full h-full object-cover scale-110"
            playsInline
            loop={true}
            muted
            style={{ filter: "blur(20px) brightness(0.7)", opacity: "0.8", zIndex: 1 }}
          />

          {/* Main Video Element */}
          <video
            ref={videoRef}
            className="relative w-full h-full object-contain cursor-pointer z-10"
            onClick={handleVideoClick}
            playsInline
            preload="metadata"
            controls={false}
            loop={true}
            autoPlay
            muted={isMuted}
          />

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <div className="bg-red-500/20 backdrop-blur-sm rounded-full p-6 mb-4">
                <AlertCircle className="w-16 h-16 text-red-400" />
              </div>
              <p className="text-xl font-semibold mb-2">Erro ao carregar vídeo</p>
              <p className="text-sm text-gray-300 mb-4">{error}</p>
              <Button
                variant="outline"
                className="bg-red-600 hover:bg-red-500 text-white border-none"
                onClick={() => currentVideo.videoUrl && loadVideo(currentVideo.videoUrl)}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleVideoClick}
                className="w-16 h-16 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all duration-300"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
          )}

          {/* Video Controls */}
          {showControls && !error && (
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-4 text-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/10 rounded-full p-2"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm font-medium min-w-[45px]">{formatDuration(currentTime)}</span>
                    <div className="flex-1 bg-white/20 rounded-full h-2 relative overflow-hidden">
                      <div
                        className="bg-white rounded-full h-2 transition-all duration-300"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isLoading}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[45px]">{formatDuration(duration)}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMute}
                    className="text-white hover:bg-white/10 rounded-full p-2"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div
            className={`absolute bottom-24 flex flex-col gap-4 z-20 transition-all duration-500 ease-in-out ${showComments ? "right-[30px]" : "right-6"}`}
          >
            {/* Profile with Follow */}
            <div className="relative group">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-white/20">
                  <AvatarImage src={currentVideo.author?.avatar || avatarImage} />
                  <AvatarFallback className="bg-gray-600 text-white font-bold">
                    {currentVideo.author?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                {currentVideo.author?.isVerified && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Verified className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              {!isFollowing && (
                <Button
                  size="sm"
                  onClick={() => setIsFollowing(true)}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-400 p-0 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Like */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={handleLike}
                className={`heart-animation w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer ${
                  isLiked ? "bg-red-500 hover:bg-red-400" : "bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                } text-white`}
              >
                <Heart className={`w-7 h-7 transition-all duration-300 ${isLiked ? "fill-current" : ""}`} />
              </div>
              <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                {(currentVideo.stats.likes + (isLiked ? 1 : 0)).toLocaleString()}
              </span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={toggleComments}
                className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer"
              >
                <MessageCircle className="w-7 h-7" />
              </div>
              <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                {currentVideo.stats.comments.toLocaleString()}
              </span>
            </div>

            {/* Favorite */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={() => setIsFavorited(!isFavorited)}
                className={`w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer ${
                  isFavorited ? "bg-yellow-500 hover:bg-yellow-400" : "bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                } text-white`}
              >
                <Bookmark className={`w-7 h-7 ${isFavorited ? "fill-current" : ""}`} />
              </div>
              <span className="text-white text-xs">Salvar</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer">
                <Share className="w-7 h-7" />
              </div>
              <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                {currentVideo.stats.shares.toLocaleString()}
              </span>
            </div>

            {/* Download */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer">
                <Download className="w-7 h-7" />
              </div>
              <span className="text-white text-xs">Download</span>
            </div>
          </div>

          {/* Comments Toggle Button (when hidden) */}
          {!showComments && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
              className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full p-3 transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Comments Panel */}
      <div
        className={`bg-white/95 backdrop-blur-sm border-l border-gray-200 flex flex-col w-96 transition-transform duration-500 ease-in-out ${
          showComments ? "translate-x-0" : "translate-x-full"
        } fixed right-0 top-0 bottom-0 z-40`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <h3 className="text-black font-semibold">Comentários</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
              className="text-black hover:bg-gray-100 rounded-full p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentVideo.author?.avatar || avatarImage} />
                <AvatarFallback className="bg-gray-600 text-white">
                  {currentVideo.author?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {currentVideo.author?.isVerified && (
                <Verified className="absolute -top-1 -right-1 w-4 h-4 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-black font-semibold text-sm">
                  {currentVideo.author?.name || userProfile.name}
                </span>
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                  Criador
                </Badge>
                <span className="text-gray-500 text-xs">{currentVideo.timestamp}</span>
              </div>
              <p className="text-gray-600 text-xs">{currentVideo.author?.username || userProfile.username}</p>
            </div>
          </div>
          <p className="text-black text-sm leading-relaxed mb-3">{currentVideo.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{viewCount.toLocaleString()} visualizações</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{currentVideo.stats.likes.toLocaleString()} curtidas</span>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3 p-4">
            {comments.map((comment, index) => (
              <div key={comment.id} className="group hover:bg-gray-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar className="w-9 h-9 flex-shrink-0">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-600 text-white text-xs">{comment.user[0]}</AvatarFallback>
                    </Avatar>
                    {comment.isVip && <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-black font-medium text-sm">{comment.user}</span>
                      {comment.isVerified && <Verified className="w-3 h-3 text-blue-400" />}
                      {comment.isVip && (
                        <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">
                          VIP
                        </Badge>
                      )}
                      <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-400 transition-colors group">
                        <Heart className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">{comment.likes}</span>
                      </button>
                      <button className="text-gray-500 hover:text-blue-400 transition-colors text-xs">Responder</button>
                      <button className="text-gray-500 hover:text-yellow-400 transition-colors">
                        <Gift className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3 mb-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={avatarImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-gray-600 text-white">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Adicione um comentário incrível..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none text-sm bg-gray-50 border-gray-200 text-black placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-400 p-1">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-400 p-1">
                    <Gift className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-gray-500">{newComment.length}/500</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
