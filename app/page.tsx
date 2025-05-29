"use client"

import type React from "react"
import { Edit, X, Youtube, Menu } from "lucide-react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Bell,
  Upload,
  Eye,
  TrendingUp,
  Star,
  MessageCircle,
  Trophy,
  Heart,
  MoreHorizontal,
  Verified,
  MapPin,
  Calendar,
  LinkIcon,
  Settings,
  UserPlus,
  Share,
  Play,
  Grid3X3,
  List,
  Crown,
  BarChart3,
  Home,
  Compass,
  Users,
  Gamepad2,
  Music,
  Palette,
  ChefHat,
  BookOpen,
  Zap,
  Film,
  Headphones,
  Code,
  Sparkles,
  AlertCircle,
} from "lucide-react"

// Adicione este componente de ícone do Spotify após as outras importações de ícones
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

// Interfaces e tipos
interface DominantColor {
  r: number
  g: number
  b: number
  count: number
}

export default function ProfilePage() {
  // Estados para o gradiente automático
  const [autoGradient, setAutoGradient] = useState<string | null>(null)
  const [dominantColors, setDominantColors] = useState<DominantColor[]>([])

  // Estados principais
  const [viewMode, setViewMode] = useState("grid")
  const [activeTab, setActiveTab] = useState("posts")
  const [coverImage, setCoverImage] = useState("/placeholder.svg?height=192&width=768")
  const [avatarImage, setAvatarImage] = useState("/placeholder.svg?height=128&width=128")

  // Estados dos modais
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)

  // Estados do post
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("Pessoal")
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null)
  const [newPostMediaType, setNewPostMediaType] = useState<"image" | "video" | "youtube" | null>(null)
  const [newPostYoutubeUrl, setNewPostYoutubeUrl] = useState("")
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [videoDuration, setVideoDuration] = useState<string | null>(null)

  // Estados do YouTube modal
  const [currentYouTubeUrl, setCurrentYouTubeUrl] = useState("")
  const [currentVideoData, setCurrentVideoData] = useState<any>(null)
  const [newComment, setNewComment] = useState("")
  const [videoComments, setVideoComments] = useState([])

  // Estados da edição de perfil
  const [editProfileSection, setEditProfileSection] = useState("profile")
  const [editingName, setEditingName] = useState("")
  const [editingBio, setEditingBio] = useState("")
  const [editingLocation, setEditingLocation] = useState("")
  const [editingWebsite, setEditingWebsite] = useState("")
  const [tempCoverImage, setTempCoverImage] = useState("")
  const [tempAvatarImage, setTempAvatarImage] = useState("")
  const [useBlurredAvatar, setUseBlurredAvatar] = useState(false)
  const [blurAmount, setBlurAmount] = useState(10)

  // Estados do Spotify
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null)
  const [spotifyUser, setSpotifyUser] = useState<any>(null)
  const [currentSpotifyTrack, setCurrentSpotifyTrack] = useState<any>(null)
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false)
  const [spotifyError, setSpotifyError] = useState<string | null>(null)
  const [spotifyGradient, setSpotifyGradient] = useState<string | null>(null)
  const [trackProgress, setTrackProgress] = useState(0)
  const [trackDuration, setTrackDuration] = useState(0)
  const [localProgress, setLocalProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(0)
  const [isSpotifyExpanded, setIsSpotifyExpanded] = useState(false)

  // Estado do mega menu
  const [megaMenuDescription, setMegaMenuDescription] = useState("Descubra mais conteúdo incrível na nossa plataforma")
  const [showMegaMenuState, setShowMegaMenuState] = useState(false)

  // Perfil do usuário
  const [userProfile, setUserProfile] = useState({
    name: "Dan",
    username: "@dan",
    bio: "🎬 Criador de conteúdo apaixonado por Tecnologia\n📚 Compartilhando conhecimento através de vídeos educativos\n🌟 Transformando ideias em histórias visuais",
    verified: true,
    location: "São Paulo, Brasil",
    website: "youtube.com",
    joinDate: "Março 2021",
    stats: {
      followers: 125600,
      following: 342,
      posts: 1247,
      likes: 2840000,
    },
    level: 28,
    exp: 6750,
    nextLevelExp: 8000,
  })

  // Posts do usuário
  const [userPosts, setUserPosts] = useState([
    {
      id: 1001,
      type: "youtube",
      title: "Neow.ai - Brainrot Gang (Official Video)",
      content:
        "3 minutes of chaos, characters, and cinematic crime. Written, animated, edited and scored by one person. Welcome to my universe.",
      thumbnail:
        "https://i.ytimg.com/vi/2D1rExarl4M/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCd5vR9GbjAUi5iAAnqS7ZB40UbTQ",
      youtubeUrl: "https://www.youtube.com/watch?v=2D1rExarl4M",
      duration: "03:00",
      stats: {
        views: 45000,
        likes: 12800,
        comments: 567,
        shares: 234,
      },
      timestamp: "1 dia atrás",
      category: "Anime",
      author: {
        name: "Dan",
        username: "@dan",
        avatar: "/placeholder.svg?height=128&width=128",
        verified: true,
      },
    },
  ])

  // Conquistas
  const achievements = []

  // Categorias e dados
  const categories = ["Pessoal", "Anime", "Tecnologia", "Jogos", "Culinária", "Música", "Arte"]
  const collections = []

  // Mega menu categorias
  const megaMenuCategories = [
    {
      title: "Navegação",
      description: "Navegue pelas principais seções da plataforma",
      items: [
        { name: "Início", icon: Home, href: "#", description: "Página inicial com conteúdo personalizado" },
        { name: "Explorar", icon: Compass, href: "#", description: "Descubra novos criadores e conteúdos" },
        { name: "Trending", icon: TrendingUp, href: "#", description: "Veja o que está em alta agora" },
        { name: "Comunidade", icon: Users, href: "#", description: "Conecte-se com outros usuários" },
      ],
    },
    {
      title: "Categorias",
      description: "Explore conteúdo por categoria de interesse",
      items: [
        { name: "Anime", icon: Star, href: "#", description: "Reviews, análises e discussões sobre anime" },
        { name: "Tecnologia", icon: Code, href: "#", description: "Tutoriais e novidades do mundo tech" },
        { name: "Jogos", icon: Gamepad2, href: "#", description: "Gameplay, reviews e dicas de jogos" },
        { name: "Música", icon: Music, href: "#", description: "Covers, análises e descobertas musicais" },
        { name: "Arte", icon: Palette, href: "#", description: "Criações artísticas e tutoriais" },
        { name: "Culinária", icon: ChefHat, href: "#", description: "Receitas e técnicas culinárias" },
      ],
    },
    {
      title: "Conteúdo",
      description: "Diferentes formatos de conteúdo disponíveis",
      items: [
        { name: "Vídeos", icon: Play, href: "#", description: "Assista vídeos de alta qualidade" },
        { name: "Lives", icon: Zap, href: "#", description: "Transmissões ao vivo interativas" },
        { name: "Podcasts", icon: Headphones, href: "#", description: "Ouça conversas e discussões" },
        { name: "Artigos", icon: BookOpen, href: "#", description: "Leia conteúdo escrito detalhado" },
      ],
    },
    {
      title: "Recursos",
      description: "Ferramentas para criadores e usuários avançados",
      items: [
        { name: "Criador Studio", icon: Film, href: "#", description: "Gerencie seu conteúdo e canal" },
        { name: "Analytics", icon: BarChart3, href: "#", description: "Acompanhe suas estatísticas" },
        { name: "Monetização", icon: Sparkles, href: "#", description: "Monetize seu conteúdo" },
        { name: "Suporte", icon: MessageCircle, href: "#", description: "Obtenha ajuda e suporte" },
      ],
    },
  ]

  // Plataformas sociais
  const socialPlatforms = [
    {
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      connected: false,
      onToggle: () => console.log("Toggle YouTube"),
    },
    {
      name: "Spotify",
      icon: Music,
      color: "text-green-600",
      connected: isSpotifyConnected,
      onToggle: () => {
        if (isSpotifyConnected) {
          handleSpotifyDisconnect()
        } else {
          handleSpotifyConnect()
        }
      },
    },
    {
      name: "Discord",
      icon: MessageCircle,
      color: "text-purple-600",
      connected: false,
      onToggle: () => console.log("Toggle Discord"),
    },
    {
      name: "Twitter",
      icon: Share,
      color: "text-blue-600",
      connected: false,
      onToggle: () => console.log("Toggle Twitter"),
    },
  ]

  // Refs para inputs de arquivo
  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const postMediaInputRef = useRef<HTMLInputElement>(null)
  const tempCoverInputRef = useRef<HTMLInputElement>(null)
  const tempAvatarInputRef = useRef<HTMLInputElement>(null)
  const colorAnalysisCanvasRef = useRef<HTMLCanvasElement>(null)

  // Inicialização dos estados de edição
  useEffect(() => {
    setEditingName(userProfile.name)
    setEditingBio(userProfile.bio)
    setEditingLocation(userProfile.location)
    setEditingWebsite(userProfile.website)
    setTempCoverImage(coverImage)
    setTempAvatarImage(avatarImage)
  }, [userProfile, coverImage, avatarImage])

  const fetchSpotifyUser = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSpotifyUser(data)
      } else {
        console.error("Erro ao buscar informações do usuário:", response.status)
      }
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error)
    }
  }

  // Efeito do Spotify
  useEffect(() => {
    // Verifica se há token do Spotify no localStorage
    const savedToken = localStorage.getItem("spotify_token")
    const savedRefreshToken = localStorage.getItem("spotify_refresh_token")

    if (savedToken) {
      setSpotifyToken(savedToken)
      setIsSpotifyConnected(true)
      fetchSpotifyUser(savedToken)
      fetchCurrentTrack(savedToken)

      // Configura intervalo para verificar música atual a cada 1 segundo
      const interval = setInterval(() => {
        fetchCurrentTrack(savedToken)
      }, 1000)

      // Configura renovação automática do token a cada 50 minutos
      const refreshInterval = setInterval(
        async () => {
          if (savedRefreshToken) {
            await refreshSpotifyToken(savedRefreshToken)
          }
        },
        50 * 60 * 1000,
      ) // 50 minutos

      return () => {
        clearInterval(interval)
        clearInterval(refreshInterval)
      }
    }

    // Verifica se voltou do callback com token
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get("access_token")
    const refreshToken = urlParams.get("refresh_token")
    const spotifyError = urlParams.get("spotify_error")

    // Se há erro do Spotify
    if (spotifyError) {
      let errorMessage = "Erro ao conectar com o Spotify"
      switch (spotifyError) {
        case "access_denied":
          errorMessage = "Acesso negado pelo usuário"
          break
        case "no_code":
          errorMessage = "Código de autorização não recebido"
          break
        case "token_exchange_failed":
          errorMessage = "Falha ao trocar código por token"
          break
        case "server_error":
          errorMessage = "Erro interno do servidor"
          break
      }
      setSpotifyError(errorMessage)

      // Remove os parâmetros da URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    if (accessToken) {
      localStorage.setItem("spotify_token", accessToken)
      if (refreshToken) {
        localStorage.setItem("spotify_refresh_token", refreshToken)
      }

      setSpotifyToken(accessToken)
      setIsSpotifyConnected(true)
      setSpotifyError(null)
      fetchSpotifyUser(accessToken)
      fetchCurrentTrack(accessToken)

      const interval = setInterval(() => {
        fetchCurrentTrack(accessToken)
      }, 1000)

      // Remove os parâmetros da URL
      window.history.replaceState({}, document.title, window.location.pathname)

      return () => clearInterval(interval)
    }
  }, [])

  // Efeito para atualizar progresso local em tempo real
  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    if (isPlaying && trackDuration > 0) {
      progressInterval = setInterval(() => {
        setLocalProgress((prev) => {
          const now = Date.now()
          const timeDiff = now - lastUpdateTime
          const newProgress = prev + timeDiff

          // Não deixa ultrapassar a duração da música
          return Math.min(newProgress, trackDuration)
        })
        setLastUpdateTime(Date.now())
      }, 100) // Atualiza a cada 100ms para suavidade
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [isPlaying, trackDuration, lastUpdateTime])

  const fetchCurrentTrack = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok && response.status !== 204) {
        const data = await response.json()
        if (data && data.item) {
          // Verifica se é uma música diferente
          const isDifferentTrack = !currentSpotifyTrack || currentSpotifyTrack.id !== data.item.id

          setCurrentSpotifyTrack(data.item)
          setIsPlaying(data.is_playing || false)
          setTrackDuration(data.item.duration_ms || 0)

          // Atualiza progresso e tempo apenas se mudou de música ou se está tocando
          if (isDifferentTrack || data.is_playing) {
            setTrackProgress(data.progress_ms || 0)
            setLocalProgress(data.progress_ms || 0)
            setLastUpdateTime(Date.now())
          }

          // Analisar cores da imagem do álbum se disponível e se mudou de música
          if (isDifferentTrack && data.item.album?.images?.[0]?.url) {
            extractSpotifyAlbumColors(data.item.album.images[0].url)
          }
        } else {
          setCurrentSpotifyTrack(null)
          setIsPlaying(false)
          setTrackProgress(0)
          setTrackDuration(0)
          setLocalProgress(0)
        }
      } else if (response.status === 204) {
        setCurrentSpotifyTrack(null)
        setIsPlaying(false)
        setTrackProgress(0)
        setTrackDuration(0)
        setLocalProgress(0)
      } else if (response.status === 401) {
        // Tentar renovar o token antes de desconectar
        const refreshToken = localStorage.getItem("spotify_refresh_token")
        if (refreshToken) {
          await refreshSpotifyToken(refreshToken)
        } else {
          handleSpotifyDisconnect()
        }
      }
    } catch (error) {
      console.error("Erro ao buscar música atual:", error)
    }
  }

  const handleSpotifyConnect = () => {
    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const redirectUri = `${window.location.origin}/api/spotify/callback`

    const scopes = [
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-email",
      "user-read-private",
    ].join(" ")

    const state = Math.random().toString(36).substring(2, 15)
    localStorage.setItem("spotify_auth_state", state)

    const authUrl = new URL("https://accounts.spotify.com/authorize")
    authUrl.searchParams.append("client_id", clientId)
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("redirect_uri", redirectUri)
    authUrl.searchParams.append("scope", scopes)
    authUrl.searchParams.append("state", state)

    window.location.href = authUrl.toString()
  }

  const handleSpotifyDisconnect = () => {
    localStorage.removeItem("spotify_token")
    localStorage.removeItem("spotify_refresh_token")
    localStorage.removeItem("spotify_auth_state")
    setSpotifyToken(null)
    setSpotifyUser(null)
    setCurrentSpotifyTrack(null)
    setIsSpotifyConnected(false)
    setSpotifyError(null)
    setLocalProgress(0)
    setIsPlaying(false)
    setLastUpdateTime(0)
  }

  const refreshSpotifyToken = async (refreshToken: string) => {
    try {
      const response = await fetch("/api/spotify/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("spotify_token", data.access_token)
        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token)
        }
        setSpotifyToken(data.access_token)
        setSpotifyError(null)
        return data.access_token
      } else {
        handleSpotifyDisconnect()
      }
    } catch (error) {
      console.error("Erro ao renovar token:", error)
      handleSpotifyDisconnect()
    }
  }

  // Funções utilitárias
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
    return colors[category as keyof typeof colors] || "text-gray-600 bg-gray-50"
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "lendário":
        return "border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50"
      case "épico":
        return "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
      case "raro":
        return "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "lendário":
        return "shadow-yellow-200"
      case "épico":
        return "shadow-purple-200"
      case "raro":
        return "shadow-blue-200"
      default:
        return ""
    }
  }

  // Funções do YouTube
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null
  }

  const openYouTubeModal = (url: string, videoData?: any) => {
    setCurrentYouTubeUrl(url)
    setCurrentVideoData(videoData)
    setShowYouTubeModal(true)
  }

  const closeYouTubeModal = () => {
    setShowYouTubeModal(false)
    setCurrentYouTubeUrl("")
    setCurrentVideoData(null)
  }

  // Funções de manipulação de arquivos
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTempCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempCoverImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTempAvatarImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempAvatarImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewPostMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPostMedia(e.target?.result as string)
        setNewPostMediaType(file.type.startsWith("video/") ? "video" : "image")
      }
      reader.readAsDataURL(file)

      if (file.type.startsWith("video/")) {
        const duration = await getVideoDuration(file)
        setVideoDuration(duration)
      }
    }
  }

  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.preload = "metadata"

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        const duration = video.duration
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`)
      }

      video.src = URL.createObjectURL(file)
    })
  }

  const handleYouTubeUrlChange = (url: string) => {
    setNewPostYoutubeUrl(url)
    if (url && extractYouTubeId(url)) {
      setNewPostMediaType("youtube")
      setNewPostMedia(getYouTubeThumbnail(url))
      setVideoDuration("15:42")
    } else {
      if (newPostMediaType === "youtube") {
        setNewPostMediaType(null)
        setNewPostMedia(null)
        setVideoDuration(null)
      }
    }
  }

  // Funções de criação e edição
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const postThumbnail =
      newPostMediaType === "youtube"
        ? getYouTubeThumbnail(newPostYoutubeUrl)
        : newPostMedia
          ? `${newPostMedia}`
          : undefined

    const post = {
      id: Date.now(),
      type: newPostMediaType === "youtube" ? "youtube" : newPostMediaType === "video" ? "video" : "post",
      title: newPostContent.length > 50 ? newPostContent.substring(0, 50) + "..." : newPostContent,
      content: newPostContent,
      thumbnail: postThumbnail,
      youtubeUrl: newPostMediaType === "youtube" ? newPostYoutubeUrl : undefined,
      duration: videoDuration || undefined,
      stats: {
        views: newPostMediaType === "video" || newPostMediaType === "youtube" ? 0 : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      timestamp: "agora",
      category: newPostCategory,
      author: {
        name: userProfile.name,
        username: userProfile.username,
        avatar: `${avatarImage}`,
        verified: userProfile.verified,
      },
    }

    setUserPosts([post, ...userPosts])

    // Reset form
    setNewPostContent("")
    setNewPostCategory("Pessoal")
    setNewPostMedia(null)
    setNewPostMediaType(null)
    setNewPostYoutubeUrl("")
    setVideoDuration(null)
    setShowYoutubeInput(false)
    setShowCreatePostModal(false)
  }

  const handleEditProfileSave = () => {
    setUserProfile((prev) => ({
      ...prev,
      name: editingName,
      bio: editingBio,
      location: editingLocation,
      website: editingWebsite,
    }))

    if (useBlurredAvatar) {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        ctx!.filter = `blur(${blurAmount}px)`
        ctx!.drawImage(img, 0, 0)

        const blurredDataUrl = canvas.toDataURL()
        setCoverImage(blurredDataUrl)
      }

      img.src = tempAvatarImage
    } else {
      setCoverImage(tempCoverImage)
    }

    setAvatarImage(tempAvatarImage)
    setShowEditProfileModal(false)
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

  // Função para extrair cores dominantes
  const extractDominantColors = useCallback((imageUrl: string) => {
    const canvas = colorAnalysisCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Redimensionar para análise mais rápida
      const maxSize = 100
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      const width = img.width * ratio
      const height = img.height * ratio

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      const colorMap = new Map<string, DominantColor>()

      // Analisar pixels
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const alpha = data[i + 3]

        // Ignorar pixels transparentes ou muito escuros/claros
        if (alpha < 128 || r + g + b < 50 || r + g + b > 650) continue

        // Agrupar cores similares
        const roundedR = Math.round(r / 20) * 20
        const roundedG = Math.round(g / 20) * 20
        const roundedB = Math.round(b / 20) * 20

        const key = `${roundedR},${roundedG},${roundedB}`

        if (colorMap.has(key)) {
          colorMap.get(key)!.count++
        } else {
          colorMap.set(key, { r: roundedR, g: roundedG, b: roundedB, count: 1 })
        }
      }

      // Ordenar por frequência e pegar as top 5
      const sortedColors = Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setDominantColors(sortedColors)
      generateAutoGradient(sortedColors)
    }

    img.src = imageUrl
  }, [])

  // Função para extrair cores da imagem do álbum do Spotify
  const extractSpotifyAlbumColors = useCallback((imageUrl: string) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Redimensionar para análise mais rápida
      const maxSize = 100
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      const width = img.width * ratio
      const height = img.height * ratio

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      const colorMap = new Map<string, DominantColor>()

      // Analisar pixels
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const alpha = data[i + 3]

        // Ignorar pixels transparentes ou muito escuros/claros
        if (alpha < 128 || r + g + b < 50 || r + g + b > 650) continue

        // Agrupar cores similares
        const roundedR = Math.round(r / 20) * 20
        const roundedG = Math.round(g / 20) * 20
        const roundedB = Math.round(b / 20) * 20

        const key = `${roundedR},${roundedG},${roundedB}`

        if (colorMap.has(key)) {
          colorMap.get(key)!.count++
        } else {
          colorMap.set(key, { r: roundedR, g: roundedG, b: roundedB, count: 1 })
        }
      }

      // Ordenar por frequência e pegar as top 5
      const sortedColors = Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Gerar gradiente para o Spotify
      generateSpotifyGradient(sortedColors)
    }

    img.src = imageUrl
  }, [])

  // Função para gerar gradiente para o card do Spotify
  const generateSpotifyGradient = (colors: DominantColor[]) => {
    if (colors.length === 0) {
      setSpotifyGradient("linear-gradient(135deg, #1DB954, #191414)")
      return
    }

    const primaryColor = colors[0]
    const secondaryColor = colors[1] || primaryColor

    // Criar versões mais escuras e suaves para o gradiente
    const darkPrimary = `rgba(${Math.round(primaryColor.r * 0.4)}, ${Math.round(primaryColor.g * 0.4)}, ${Math.round(primaryColor.b * 0.4)}, 0.9)`
    const lightSecondary = `rgba(${Math.round(secondaryColor.r * 0.6)}, ${Math.round(secondaryColor.g * 0.6)}, ${Math.round(secondaryColor.b * 0.6)}, 0.8)`

    const gradient = `linear-gradient(135deg, ${darkPrimary}, ${lightSecondary})`
    setSpotifyGradient(gradient)
  }

  // Função para gerar gradiente automático
  const generateAutoGradient = (colors: DominantColor[]) => {
    if (colors.length === 0) {
      setAutoGradient("linear-gradient(135deg, #1a1a1a, #000)")
      return
    }

    const primaryColor = colors[0]
    const secondaryColor = colors[1] || primaryColor

    // Criar versões mais escuras e suaves para o gradiente
    const darkPrimary = `rgb(${Math.round(primaryColor.r * 0.2)}, ${Math.round(primaryColor.g * 0.2)}, ${Math.round(primaryColor.b * 0.2)})`
    const mediumPrimary = `rgb(${Math.round(primaryColor.r * 0.35)}, ${Math.round(primaryColor.g * 0.35)}, ${Math.round(primaryColor.b * 0.35)})`
    const lightSecondary = `rgb(${Math.round(secondaryColor.r * 0.5)}, ${Math.round(secondaryColor.g * 0.5)}, ${Math.round(secondaryColor.b * 0.5)})`

    const gradient = `linear-gradient(45deg, ${lightSecondary} 0%, ${mediumPrimary} 50%, ${darkPrimary} 100%)`
    setAutoGradient(gradient)
  }

  // useEffect para analisar avatar quando mudar
  useEffect(() => {
    if (avatarImage && avatarImage !== "/placeholder.svg?height=128&width=128") {
      extractDominantColors(avatarImage)
    }
  }, [avatarImage, extractDominantColors])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hidden file inputs */}
      <input type="file" ref={coverInputRef} onChange={handleCoverImageChange} accept="image/*" className="hidden" />
      <input type="file" ref={avatarInputRef} onChange={handleAvatarImageChange} accept="image/*" className="hidden" />
      <input
        type="file"
        ref={postMediaInputRef}
        onChange={handleNewPostMediaChange}
        accept="image/*,video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={tempCoverInputRef}
        onChange={handleTempCoverImageChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={tempAvatarInputRef}
        onChange={handleTempAvatarImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Spotify Error Notification */}
      {spotifyError && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">Erro no Spotify</h4>
                <p className="text-sm text-red-700 mt-1">{spotifyError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSpotifyError(null)}
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMegaMenuState(!showMegaMenuState)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Menu className="w-5 h-5 text-gray-600" />
                    </Button>

                    {/* Mega Menu */}
                    {showMegaMenuState && (
                      <div className="absolute top-full left-0 mt-2 w-[800px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50">
                        <div className="p-6">
                          <div className="grid grid-cols-4 gap-8">
                            {megaMenuCategories.map((category, index) => (
                              <div key={index} className="space-y-4">
                                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                                  {category.title}
                                </h3>
                                <ul className="space-y-3">
                                  {category.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      <a
                                        href={item.href}
                                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group"
                                        onMouseEnter={() => setMegaMenuDescription(item.description)}
                                        onMouseLeave={() =>
                                          setMegaMenuDescription("Descubra mais conteúdo incrível na nossa plataforma")
                                        }
                                      >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                          <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">{item.name}</span>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-gray-100 mt-6 pt-6">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">{megaMenuDescription}</div>
                              <Button
                                onClick={() => setShowMegaMenuState(false)}
                                variant="outline"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Fechar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">BILIBILI</span>
              </div>
              <nav className="hidden md:flex gap-6">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Início
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Explorar
                </Button>
                <Button variant="ghost" className="text-blue-600 font-medium">
                  Perfil
                </Button>
              </nav>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  placeholder="Buscar..."
                  className="pl-4 pr-10 py-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button size="sm" className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCreatePostModal(true)}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 border"
              >
                <Upload className="w-4 h-4 mr-2" />
                Criar Post
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={avatarImage || "/placeholder.svg"} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Overlay para fechar o mega menu */}
        {showMegaMenuState && (
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMegaMenuState(false)} />
        )}
      </header>

      <div className="max-w-6xl mx-auto px-6">
        {/* Cover Image */}
        <div
          className="relative h-48 rounded-b-2xl overflow-hidden"
          style={{
            background:
              coverImage && coverImage !== "/placeholder.svg?height=192&width=768"
                ? "none"
                : autoGradient || "linear-gradient(to-r, #3b82f6, #8b5cf6)",
          }}
        >
          {coverImage && coverImage !== "/placeholder.svg?height=192&width=768" ? (
            <>
              <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-black/20"></div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900"
            onClick={() => setShowEditProfileModal(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar perfil
          </Button>
        </div>

        {/* Profile Section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Profile Info */}
            <div className="flex-1">
              <div className="flex items-end gap-6 -mt-16 mb-6">
                {/* Avatar with Frame */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
                    <Avatar
                      className="w-full h-full border-4 border-white cursor-pointer"
                      onClick={() => setShowAvatarModal(true)}
                    >
                      <AvatarImage src={avatarImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl"></AvatarFallback>
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

            {/* Right Column - Sidebar */}
            <div className="lg:w-80 space-y-6" style={{ marginTop: "10px" }}>
              {/* Spotify Section - só mostra quando há música tocando */}
              {isSpotifyConnected && currentSpotifyTrack && (
                <Card
                  className={`relative overflow-hidden border border-gray-200 transition-all duration-500 ease-in-out ${
                    isSpotifyExpanded ? "transform scale-100" : "hover:scale-105 hover:shadow-lg cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!isSpotifyExpanded) {
                      setIsSpotifyExpanded(true)
                    }
                  }}
                >
                  {/* Background gradiente */}
                  <div
                    className="absolute inset-0 z-0 transition-opacity duration-500"
                    style={{
                      background: isPlaying
                        ? spotifyGradient || "linear-gradient(135deg, #1DB954, #191414)"
                        : "linear-gradient(135deg, #f97316, #ea580c)", // Gradiente laranja para pausado
                      opacity: isSpotifyExpanded ? 0.85 : 0.95,
                    }}
                  ></div>

                  {/* Ícone do Spotify no canto superior direito */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isSpotifyExpanded) {
                          setIsSpotifyExpanded(false)
                        }
                      }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSpotifyExpanded
                          ? "bg-[#1DB954] hover:scale-110 hover:bg-[#1ed760] shadow-lg"
                          : isPlaying
                            ? "bg-[#1DB954] animate-pulse"
                            : "bg-orange-500 animate-none"
                      }`}
                    >
                      <SpotifyIcon className="w-3 h-3 text-white" />
                    </button>
                  </div>

                  <CardContent
                    className={`relative z-10 transition-all duration-500 ease-in-out ${
                      isSpotifyExpanded ? "p-3" : "p-2"
                    }`}
                    onClick={(e) => {
                      if (isSpotifyExpanded) {
                        e.stopPropagation()
                        setIsSpotifyExpanded(false)
                      }
                    }}
                  >
                    {!isSpotifyExpanded ? (
                      // Estado Mínimo
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isPlaying ? "bg-[#1DB954] animate-pulse" : "bg-orange-500"
                          }`}
                        ></div>
                        <span className="text-white text-sm font-medium truncate drop-shadow-sm">
                          {isPlaying ? "Ouvindo" : "Pausado"} - {currentSpotifyTrack.name}
                        </span>
                      </div>
                    ) : (
                      // Estado Expandido
                      <div className="animate-fadeIn">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative">
                            <img
                              src={currentSpotifyTrack.album?.images?.[2]?.url || "/placeholder.svg"}
                              alt="Album cover"
                              className="w-12 h-12 rounded-md object-cover shadow-md transform transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-md"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate text-sm drop-shadow-sm animate-slideInLeft">
                              {currentSpotifyTrack.name}
                            </p>
                            <p className="text-xs text-gray-100 truncate opacity-90 animate-slideInLeft animation-delay-100">
                              {currentSpotifyTrack.artists?.map((artist: any) => artist.name).join(", ")}
                            </p>
                            <div className="flex items-center gap-1 mt-1 animate-slideInLeft animation-delay-200">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isPlaying ? "bg-[#1DB954] animate-pulse" : "bg-orange-500"
                                }`}
                              ></div>
                              <span className="text-xs text-gray-100">{isPlaying ? "Tocando agora" : "Pausado"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Barra de progresso */}
                        <div className="space-y-1 animate-slideInUp animation-delay-300">
                          <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-white h-1 rounded-full transition-all duration-100 ease-linear shadow-sm"
                              style={{
                                width: trackDuration > 0 ? `${(localProgress / trackDuration) * 100}%` : "0%",
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-100 opacity-90">
                            <span>{formatTime(localProgress)}</span>
                            <span>{formatTime(trackDuration)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* Indicador visual de que é clicável (apenas no estado mínimo) */}
                  {!isSpotifyExpanded && (
                    <div className="absolute bottom-1 right-1 z-10">
                      <div className="w-1 h-1 bg-white/50 rounded-full animate-ping"></div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid grid-cols-4 w-fit">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="videos">Vídeos</TabsTrigger>
                <TabsTrigger value="collections">Coleções</TabsTrigger>
                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              </TabsList>

              {(activeTab === "posts" || activeTab === "videos") && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <div className="min-h-[400px]">
                {userPosts.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"
                    }
                  >
                    {userPosts.map((post) =>
                      viewMode === "grid" ? (
                        // Grid View - Card Style
                        <Card
                          key={post.id}
                          className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 transform hover:scale-105 cursor-pointer"
                          onClick={() => {
                            if (post.type === "youtube" && post.youtubeUrl) {
                              openYouTubeModal(post.youtubeUrl, post)
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
                            <Badge className={`absolute top-2 left-2 ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Author Info */}
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={post.author?.avatar || avatarImage || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">{post.author?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-700">
                                  {post.author?.name || userProfile.name}
                                </span>
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
                        // List View - Original Style
                        <Card
                          key={post.id}
                          className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl bg-white transform hover:scale-[1.02]"
                        >
                          <CardContent className="p-6">
                            {/* Header do Post */}
                            <div className="flex gap-4 mb-4">
                              <Avatar className="w-12 h-12 ring-2 ring-gray-100">
                                <AvatarImage src={post.author?.avatar || avatarImage || "/placeholder.svg"} />
                                <AvatarFallback>{post.author?.name?.[0] || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900">
                                    {post.author?.name || userProfile.name}
                                  </span>
                                  {post.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                                  <span className="text-gray-500 text-sm">
                                    {post.author?.username || userProfile.username}
                                  </span>
                                  <span className="text-gray-400">·</span>
                                  <span className="text-gray-500 text-sm">{post.timestamp}</span>
                                </div>
                                <Badge className={`w-fit ${getCategoryColor(post.category)}`}>{post.category}</Badge>
                              </div>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Conteúdo do Post */}
                            <div className="space-y-4">
                              {/* Layout dividido: conteúdo à esquerda, mídia à direita */}
                              <div className="flex gap-6">
                                {/* Lado esquerdo - Conteúdo */}
                                <div className="flex-1">
                                  <p className="text-gray-900 leading-relaxed text-base">{post.content}</p>
                                </div>

                                {/* Lado direito - Mídia (miniatura) */}
                                {post.thumbnail && (
                                  <div className="w-48 flex-shrink-0">
                                    <div className="relative rounded-xl overflow-hidden shadow-md h-32 bg-gray-100">
                                      {post.type === "youtube" ? (
                                        <div className="relative h-full">
                                          <img
                                            src={post.thumbnail || "/placeholder.svg"}
                                            alt="YouTube thumbnail"
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() => post.youtubeUrl && openYouTubeModal(post.youtubeUrl, post)}
                                          />
                                          <div
                                            className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
                                            onClick={() => post.youtubeUrl && openYouTubeModal(post.youtubeUrl, post)}
                                          >
                                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg">
                                              <Play className="w-5 h-5 text-white ml-0.5" />
                                            </div>
                                          </div>
                                        </div>
                                      ) : post.type === "video" ? (
                                        <div className="relative h-full">
                                          <img
                                            src={post.thumbnail || "/placeholder.svg"}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover cursor-pointer"
                                          />
                                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer">
                                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg">
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

                              {/* Ações do Post - Movidas para baixo */}
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
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Play className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhum post ainda</h3>
                    <p className="text-sm text-center">Quando você criar posts, eles aparecerão aqui.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="min-h-[400px]">
                {userPosts.filter((post) => post.type === "video" || post.type === "youtube").length > 0 ? (
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"
                    }
                  >
                    {userPosts
                      .filter((post) => post.type === "video" || post.type === "youtube")
                      .map((video) =>
                        viewMode === "grid" ? (
                          // Grid View
                          <Card
                            key={video.id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 transform hover:scale-105 cursor-pointer"
                            onClick={() => {
                              if (video.type === "youtube" && video.youtubeUrl) {
                                openYouTubeModal(video.youtubeUrl, video)
                              }
                            }}
                          >
                            <div className="relative">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.content}
                                className="w-full object-cover h-40"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                  <Play className="w-6 h-6 text-white ml-0.5" />
                                </div>
                              </div>
                              {video.duration && (
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                  {video.duration}
                                </div>
                              )}
                              <Badge className={`absolute top-2 left-2 ${getCategoryColor(video.category)}`}>
                                {video.category}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Author Info */}
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={video.author?.avatar || avatarImage || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {video.author?.name?.[0] || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium text-gray-700">
                                    {video.author?.name || userProfile.name}
                                  </span>
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
                            className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl bg-white transform hover:scale-[1.02]"
                          >
                            <CardContent className="p-6">
                              {/* Header do Vídeo */}
                              <div className="flex gap-4 mb-4">
                                <Avatar className="w-12 h-12 ring-2 ring-gray-100">
                                  <AvatarImage src={video.author?.avatar || avatarImage || "/placeholder.svg"} />
                                  <AvatarFallback>{video.author?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">
                                      {video.author?.name || userProfile.name}
                                    </span>
                                    {video.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                                    <span className="text-gray-500 text-sm">
                                      {video.author?.username || userProfile.username}
                                    </span>
                                    <span className="text-gray-400">·</span>
                                    <span className="text-gray-500 text-sm">{video.timestamp}</span>
                                  </div>
                                  <Badge className={`w-fit ${getCategoryColor(video.category)}`}>
                                    {video.category}
                                  </Badge>
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

                                  {video.thumbnail && (
                                    <div className="w-48 flex-shrink-0">
                                      <div className="relative rounded-xl overflow-hidden shadow-md h-32 bg-gray-100">
                                        <img
                                          src={video.thumbnail || "/placeholder.svg"}
                                          alt="Video thumbnail"
                                          className="w-full h-full object-cover cursor-pointer"
                                          onClick={() => {
                                            if (video.type === "youtube" && video.youtubeUrl) {
                                              openYouTubeModal(video.youtubeUrl, video)
                                            }
                                          }}
                                        />
                                        <div
                                          className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
                                          onClick={() => {
                                            if (video.type === "youtube" && video.youtubeUrl) {
                                              openYouTubeModal(video.youtubeUrl, video)
                                            }
                                          }}
                                        >
                                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg">
                                            <Play className="w-5 h-5 text-white ml-0.5" />
                                          </div>
                                        </div>
                                        {video.duration && (
                                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                            {video.duration}
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
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Play className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhum vídeo ainda</h3>
                    <p className="text-sm text-center">Quando você postar vídeos, eles aparecerão aqui.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Collections Tab */}
            <TabsContent value="collections">
              <div className="min-h-[400px]">
                {collections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                      <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img
                            src={collection.thumbnail || "/placeholder.svg"}
                            alt={collection.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {collection.itemCount} itens
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{collection.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Criada em {collection.createdAt}</span>
                            <span>{collection.visibility}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Star className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma coleção ainda</h3>
                    <p className="text-sm text-center">Organize seus posts favoritos em coleções personalizadas.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="min-h-[400px]">
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => (
                      <Card
                        key={achievement.id}
                        className={`overflow-hidden transition-all duration-300 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} shadow-lg`}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="mb-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                              <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{achievement.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                            <Badge className={`${getCategoryColor(achievement.rarity)} capitalize`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">Conquistada em {achievement.unlockedAt}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Trophy className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma conquista ainda</h3>
                    <p className="text-sm text-center">
                      Continue criando conteúdo para desbloquear conquistas incríveis!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Canvas oculto para análise de cores */}
      <canvas ref={colorAnalysisCanvasRef} className="hidden" />

      {/* Modal de Criação de Post */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Criar novo post</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreatePostModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="O que você está pensando?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                ></textarea>
              </div>

              {newPostMedia && (
                <div className="relative">
                  {newPostMediaType === "image" ? (
                    <img
                      src={newPostMedia || "/placeholder.svg"}
                      alt="Post media"
                      className="w-full rounded-lg max-h-[300px] object-cover"
                    />
                  ) : newPostMediaType === "video" ? (
                    <video src={newPostMedia} controls className="w-full rounded-lg max-h-[300px] object-cover"></video>
                  ) : newPostMediaType === "youtube" ? (
                    <div className="relative">
                      <img
                        src={newPostMedia || "/placeholder.svg"}
                        alt="YouTube thumbnail"
                        className="w-full rounded-lg max-h-[300px] object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setNewPostMedia(null)
                      setNewPostMediaType(null)
                      setNewPostYoutubeUrl("")
                      setVideoDuration(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {showYoutubeInput && !newPostMedia && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Cole o link do YouTube aqui"
                    value={newPostYoutubeUrl}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowYoutubeInput(false)
                      setNewPostYoutubeUrl("")
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => postMediaInputRef.current?.click()}
                    disabled={!!newPostMedia}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Mídia
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowYoutubeInput(true)}
                    disabled={!!newPostMedia || showYoutubeInput}
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube
                  </Button>
                </div>
                <div>
                  <select
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                Publicar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Perfil */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Editar perfil</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditProfileModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium ${
                    editProfileSection === "profile" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => setEditProfileSection("profile")}
                >
                  Perfil
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    editProfileSection === "appearance" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => setEditProfileSection("appearance")}
                >
                  Aparência
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    editProfileSection === "connections" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => setEditProfileSection("connections")}
                >
                  Conexões
                </button>
              </div>

              {editProfileSection === "profile" && (
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editingBio}
                      onChange={(e) => setEditingBio(e.target.value)}
                      className="w-full border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Conte um pouco sobre você"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                    <Input
                      value={editingLocation}
                      onChange={(e) => setEditingLocation(e.target.value)}
                      className="w-full"
                      placeholder="Sua localização"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <Input
                      value={editingWebsite}
                      onChange={(e) => setEditingWebsite(e.target.value)}
                      className="w-full"
                      placeholder="Seu website"
                    />
                  </div>
                </div>
              )}

              {editProfileSection === "appearance" && (
                <div className="space-y-6 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de capa</label>
                    <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={tempCoverImage || "/placeholder.svg"}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2 bg-white/90"
                        onClick={() => tempCoverInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Alterar
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto de perfil</label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                        <AvatarImage src={tempAvatarImage || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl"></AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" onClick={() => tempAvatarInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Alterar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">Usar avatar como capa (com blur)</label>
                      <input
                        type="checkbox"
                        checked={useBlurredAvatar}
                        onChange={(e) => setUseBlurredAvatar(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    {useBlurredAvatar && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Intensidade do blur</label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={blurAmount}
                          onChange={(e) => setBlurAmount(Number.parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {editProfileSection === "connections" && (
                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Conecte suas contas de redes sociais para compartilhar atividades e aumentar seu alcance.
                  </p>

                  {socialPlatforms.map((platform) => (
                    <div
                      key={platform.name}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${platform.color}`}>
                          <platform.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{platform.name}</h4>
                          <p className="text-xs text-gray-500">{platform.connected ? "Conectado" : "Não conectado"}</p>
                        </div>
                      </div>
                      <Button
                        variant={platform.connected ? "destructive" : "outline"}
                        size="sm"
                        onClick={platform.onToggle}
                      >
                        {platform.connected ? "Desconectar" : "Conectar"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditProfileModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditProfileSave}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de YouTube */}
      {showYouTubeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold truncate flex-1">{currentVideoData?.title || "Assistir vídeo"}</h3>
              <Button variant="ghost" size="sm" onClick={closeYouTubeModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(currentYouTubeUrl)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-xl font-bold">{currentVideoData?.title || "Título do vídeo"}</h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span>{formatNumber(currentVideoData?.stats?.views || 0)} visualizações</span>
                  <span>•</span>
                  <span>{currentVideoData?.timestamp || "há 1 dia"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 border-y">
                <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{formatNumber(currentVideoData?.stats?.likes || 0)}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{formatNumber(currentVideoData?.stats?.comments || 0)}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors">
                  <Share className="w-5 h-5" />
                  <span>{formatNumber(currentVideoData?.stats?.shares || 0)}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={currentVideoData?.author?.avatar || avatarImage || "/placeholder.svg"}
                      alt={currentVideoData?.author?.name || "Author"}
                    />
                    <AvatarFallback>{(currentVideoData?.author?.name || "A").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{currentVideoData?.author?.name || "Nome do autor"}</span>
                      {currentVideoData?.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{currentVideoData?.author?.username || "@username"}</p>
                  </div>
                </div>

                <p className="text-gray-800 whitespace-pre-line">{currentVideoData?.content || ""}</p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Comentários ({formatNumber(videoComments.length)})</h3>

                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarImage || "/placeholder.svg"} />
                    <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Adicione um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {videoComments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-800">{comment.comment}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">Responder</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Avatar */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Foto de perfil</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAvatarModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <Avatar className="w-48 h-48 border-4 border-white shadow-lg mb-6">
                <AvatarImage src={avatarImage || "/placeholder.svg"} />
                <AvatarFallback className="text-6xl"></AvatarFallback>
              </Avatar>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => avatarInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Alterar
                </Button>
                <Button variant="destructive" onClick={() => setAvatarImage("/placeholder.svg?height=128&width=128")}>
                  <X className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
