"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Post, UserProfile } from "@/hooks/use-profile"
import { detectYouTubeUrl, generateVideoThumbnail, getVideoDuration, getYouTubeThumbnail } from "@/lib/video-utils"
import { X, ImageIcon, BarChart3, Smile, Plus, Minus, Video, Youtube } from "lucide-react"

interface CreatePostModalProps {
  userProfile: UserProfile
  avatarImage: string
  onClose: () => void
  onAddPost: (post: Post) => void
  onAddVideo: (video: Post) => void
}

export function CreatePostModal({ userProfile, avatarImage, onClose, onAddPost, onAddVideo }: CreatePostModalProps) {
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("Pessoal")
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null)
  const [newPostMediaType, setNewPostMediaType] = useState<"image" | "video" | "youtube" | null>(null)
  const [detectedYouTubeUrl, setDetectedYouTubeUrl] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<string | null>(null)
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""])
  const [isProcessingVideo, setIsProcessingVideo] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const categories = ["Pessoal", "Anime", "Tecnologia", "Jogos", "Culinária", "Música", "Arte"]

  // Detectar automaticamente URLs do YouTube no texto
  const handleContentChange = useCallback(
    (content: string) => {
      setNewPostContent(content)

      const youtubeUrl = detectYouTubeUrl(content)
      if (youtubeUrl && youtubeUrl !== detectedYouTubeUrl) {
        setDetectedYouTubeUrl(youtubeUrl)
        setNewPostMediaType("youtube")
        setNewPostMedia(getYouTubeThumbnail(youtubeUrl))
        setVideoDuration("15:42") // Placeholder para vídeos do YouTube
      } else if (!youtubeUrl && detectedYouTubeUrl) {
        setDetectedYouTubeUrl(null)
        if (newPostMediaType === "youtube") {
          setNewPostMediaType(null)
          setNewPostMedia(null)
          setVideoDuration(null)
        }
      }
    },
    [detectedYouTubeUrl, newPostMediaType],
  )

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPostMedia(e.target?.result as string)
        setNewPostMediaType("image")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsProcessingVideo(true)

      try {
        // Gerar thumbnail
        const thumbnail = await generateVideoThumbnail(file)

        // Obter duração
        const duration = await getVideoDuration(file)

        // Criar URL do vídeo
        const videoUrl = URL.createObjectURL(file)

        setNewPostMedia(thumbnail)
        setNewPostMediaType("video")
        setVideoDuration(duration)

        // Armazenar a URL do vídeo para uso posterior
        ;(event.target as any).videoUrl = videoUrl
      } catch (error) {
        console.error("Erro ao processar vídeo:", error)
        alert("Erro ao processar o vídeo. Tente novamente.")
      } finally {
        setIsProcessingVideo(false)
      }
    }
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const basePost = {
      id: Date.now(),
      title: newPostContent.length > 50 ? newPostContent.substring(0, 50) + "..." : newPostContent,
      content: newPostContent,
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
      timestamp: "agora",
      category: newPostCategory,
      author: {
        name: userProfile.name,
        username: userProfile.username,
        avatar: avatarImage,
        verified: userProfile.verified,
      },
    }

    if (newPostMediaType === "video") {
      // Vídeo local vai para a aba "Vídeos"
      const videoInput = videoInputRef.current as any
      const videoUrl = videoInput?.videoUrl

      const videoPost: Post = {
        ...basePost,
        type: "video",
        thumbnail: newPostMedia || undefined,
        videoUrl: videoUrl,
        duration: videoDuration || undefined,
        stats: {
          ...basePost.stats,
          views: 0,
        },
      }

      onAddVideo(videoPost)
    } else {
      // Posts (texto, imagem, YouTube) vão para a aba "Posts"
      const post: Post = {
        ...basePost,
        type: newPostMediaType === "youtube" ? "youtube" : newPostMediaType === "image" ? "image" : "post",
        thumbnail: newPostMedia || undefined,
        youtubeUrl: detectedYouTubeUrl || undefined,
        duration: newPostMediaType === "youtube" ? videoDuration || undefined : undefined,
        stats: {
          ...basePost.stats,
          views: newPostMediaType === "youtube" ? 0 : undefined,
        },
      }

      onAddPost(post)
    }

    // Reset form
    setNewPostContent("")
    setNewPostCategory("Pessoal")
    setNewPostMedia(null)
    setNewPostMediaType(null)
    setDetectedYouTubeUrl(null)
    setVideoDuration(null)
    setShowPollCreator(false)
    setPollOptions(["", ""])
    onClose()
  }

  const removeMedia = () => {
    setNewPostMedia(null)
    setNewPostMediaType(null)
    setVideoDuration(null)
    setDetectedYouTubeUrl(null)

    // Limpar inputs
    if (imageInputRef.current) imageInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Criar Post</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-blue-100">
                <AvatarImage src={avatarImage || "/placeholder.svg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="Compartilhe algo interessante... (Cole links do YouTube diretamente aqui!)"
                  value={newPostContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="min-h-[120px] max-h-[200px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />

                {/* YouTube Detection Alert */}
                {detectedYouTubeUrl && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-semibold text-red-700">Vídeo do YouTube detectado!</span>
                    </div>
                    <p className="text-sm text-red-600">
                      Encontramos um link do YouTube no seu texto. O vídeo será exibido na aba "Posts".
                    </p>
                  </div>
                )}

                {/* Media Preview */}
                {newPostMedia && (
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={newPostMedia || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {newPostMediaType === "image" && "Imagem anexada"}
                        {newPostMediaType === "video" && "Vídeo anexado (será exibido na aba Vídeos)"}
                        {newPostMediaType === "youtube" && "Vídeo do YouTube (será exibido na aba Posts)"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {videoDuration ? `Duração: ${videoDuration}` : "Clique em publicar para compartilhar"}
                      </p>
                      {isProcessingVideo && <p className="text-xs text-blue-600">Processando vídeo...</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 rounded-full"
                      onClick={removeMedia}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Poll Creator */}
                {showPollCreator && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-4 space-y-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-700">Criar Enquete</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPollCreator(false)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          placeholder={`Opção ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...pollOptions]
                            newOptions[index] = e.target.value
                            setPollOptions(newOptions)
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {index > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 rounded-full"
                            onClick={() => {
                              const newOptions = [...pollOptions]
                              newOptions.splice(index, 1)
                              setPollOptions(newOptions)
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 4 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPollOptions([...pollOptions, ""])}
                        className="text-blue-600 hover:bg-blue-50 w-full rounded-xl border border-dashed border-blue-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-blue-600 hover:bg-blue-50 rounded-full p-3 transition-all duration-200 hover:scale-105"
                      title="Adicionar imagem"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => videoInputRef.current?.click()}
                      className="text-purple-600 hover:bg-purple-50 rounded-full p-3 transition-all duration-200 hover:scale-105"
                      title="Adicionar vídeo local"
                      disabled={isProcessingVideo}
                    >
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPollCreator(!showPollCreator)}
                      className="text-green-600 hover:bg-green-50 rounded-full p-3 transition-all duration-200 hover:scale-105"
                      title="Criar enquete"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-600 hover:bg-yellow-50 rounded-full p-3 transition-all duration-200 hover:scale-105"
                      title="Adicionar emoji"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>

                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="ml-3 px-4 py-2 border border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {newPostContent.length}/500
                    </span>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || isProcessingVideo}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingVideo ? "Processando..." : "Publicar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/*,.m3u8" className="hidden" />
    </div>
  )
}
