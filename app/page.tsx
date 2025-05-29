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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Shield,
  Lock,
  Mail,
  Type,
  Volume2,
  Monitor,
  Smartphone,
  Languages,
  LogOut,
} from "lucide-react"

// Substitua o CSS do marquee por este:
const marqueeStyles = `
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    width: 100%;
  }
  
  .marquee-content {
    display: inline-block;
    animation: marquee 15s linear infinite;
  }
  
  .marquee-content.paused {
    animation-play-state: paused;
  }
  
  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    20% {
      transform: translateX(0%);
    }
    80% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  
  .text-fade-container {
    position: relative;
    overflow: hidden;
  }
`

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

  // Efeito para injetar os estilos CSS do marquee
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = marqueeStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

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
  const [editingName, setEditingName] = useState("")
  const [editingBio, setEditingBio] = useState("")
  const [editingLocation, setEditingLocation] = useState("")
  const [editingWebsite, setEditingWebsite] = useState("")
  const [tempCoverImage, setTempCoverImage] = useState("")
  const [tempAvatarImage, setTempAvatarImage] = useState("")
  const [showRemoveCoverModal, setShowRemoveCoverModal] = useState(false)
  // Adicione este estado após os outros estados de edição de perfil
  const [tempCoverRemoved, setTempCoverRemoved] = useState(false)
  const [showRemoveCoverConfirmModal, setShowRemoveCoverConfirmModal] = useState(false)

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

  // Adicionar estados para o menu dropdown após os outros estados:
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userMenuSection, setUserMenuSection] = useState("main")

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

      // Configura intervalo para verificar música atual a cada 0.5 segundo
      const interval = setInterval(() => {
        fetchCurrentTrack(savedToken)
      }, 500) // Mudado de 1000 para 500

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

      // Configura intervalo para verificar música atual a cada 0.5 segundo
      const interval = setInterval(() => {
        fetchCurrentTrack(accessToken)
      }, 500) // Mudado de 1000 para 500

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

    // Se a capa foi removida, aplicar a remoção
    if (tempCoverRemoved) {
      setCoverImage("/placeholder.svg?height=192&width=768")
    } else {
      setCoverImage(tempCoverImage)
    }

    setAvatarImage(tempAvatarImage)
    setTempCoverRemoved(false)
    setShowEditProfileModal(false)
  }

  const handleCancelEdit = () => {
    // Restaurar os valores originais
    setEditingName(userProfile.name)
    setEditingBio(userProfile.bio)
    setEditingLocation(userProfile.location)
    setEditingWebsite(userProfile.website)
    setTempCoverImage(coverImage)
    setTempAvatarImage(avatarImage)
    setTempCoverRemoved(false)
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
              {/* Substituir o Avatar no header por este código com dropdown: */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarImage || "/placeholder.svg"} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {userMenuSection === "main" && (
                      <div className="p-4">
                        {/* User Info Header */}
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg mb-2">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={avatarImage || "/placeholder.svg"} />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{userProfile.name}</div>
                            <div className="text-sm text-gray-600">Ver seu perfil</div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          {/* Connections Section */}
                          <div className="mb-3">
                            <div className="px-3 py-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Conexões
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => {
                                    if (isSpotifyConnected) {
                                      handleSpotifyDisconnect()
                                    } else {
                                      handleSpotifyConnect()
                                    }
                                  }}
                                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                                    isSpotifyConnected
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  <SpotifyIcon className="w-4 h-4" />
                                  <span>Spotify</span>
                                  {isSpotifyConnected && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                                  )}
                                </button>

                                <button className="flex items-center gap-2 p-2 rounded-lg text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                                  <Music className="w-4 h-4" />
                                  <span>Deezer</span>
                                </button>

                                <button className="flex items-center gap-2 p-2 rounded-lg text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                                  <Youtube className="w-4 h-4" />
                                  <span>YouTube</span>
                                </button>

                                <button className="flex items-center gap-2 p-2 rounded-lg text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                                  <Headphones className="w-4 h-4" />
                                  <span>SoundCloud</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <button
                            onClick={() => setUserMenuSection("settings")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Settings className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">Configurações e privacidade</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("help")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">Ajuda e suporte</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("accessibility")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">Acessibilidade</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("display")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Palette className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">Exibição e acessibilidade</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                              <LogOut className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-900 font-medium text-sm">Sair</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manter as outras seções do menu iguais */}
                    {userMenuSection === "settings" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 text-sm">Configurações e privacidade</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Configurações</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Shield className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Privacidade</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Notificações</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Lock className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Segurança</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "help" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 text-sm">Ajuda e suporte</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <MessageCircle className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Central de ajuda</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Entrar em contato</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <AlertCircle className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Reportar problema</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <BookOpen className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Termos de uso</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "accessibility" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 text-sm">Acessibilidade</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Eye className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Leitor de tela</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Type className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Tamanho da fonte</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Zap className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Reduzir animações</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Volume2 className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Áudio descrição</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "display" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 text-sm">Exibição e acessibilidade</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Palette className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Modo escuro</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Monitor className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Compactar feeds</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Modo móvel</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Languages className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900 text-sm">Idioma</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay para fechar o mega menu */}
        {showMegaMenuState && (
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMegaMenuState(false)} />
        )}
        {/* Overlay para fechar o user menu */}
        {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
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
                    isSpotifyExpanded ? "transform scale-100" : "cursor-pointer"
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
                        : "linear-gradient(135deg, #2d3748, #1a202c)", // Gradiente azul-cinza escuro para pausado
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
                            ? "bg-[#1DB954]"
                            : "bg-gray-600"
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
                    {/* Estado Mínimo */}
                    {!isSpotifyExpanded ? (
                      <div className="flex items-center gap-2 pr-8 overflow-hidden">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isPlaying ? "bg-[#1DB954]" : "bg-orange-400"
                          }`}
                        ></div>
                        <div className="flex items-center min-w-0 flex-1">
                          <span className="text-white text-sm font-medium flex-shrink-0 mr-1">
                            {isPlaying ? "Ouvindo" : "Pausado"} -
                          </span>
                          <div className="overflow-hidden flex-1 relative">
                            {currentSpotifyTrack.name.length > 25 ? (
                              <div className="marquee-container">
                                <div className="marquee-content text-white text-sm font-medium">
                                  {currentSpotifyTrack.name}
                                </div>
                              </div>
                            ) : (
                              <div className="text-white text-sm font-medium truncate">{currentSpotifyTrack.name}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Estado Expandido */
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
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="overflow-hidden flex-1 relative">
                              {currentSpotifyTrack.name.length > 20 ? (
                                <div className="marquee-container">
                                  <div className="marquee-content font-medium text-white text-sm drop-shadow-sm">
                                    {currentSpotifyTrack.name}
                                  </div>
                                </div>
                              ) : (
                                <p className="font-medium text-white text-sm drop-shadow-sm truncate">
                                  {currentSpotifyTrack.name}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-100 truncate opacity-90">
                              {currentSpotifyTrack.artists?.map((artist: any) => artist.name).join(", ")}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <div
                                className={`w-2 h-2 rounded-full ${isPlaying ? "bg-[#1DB954]" : "bg-orange-400"}`}
                              ></div>
                              <span className="text-xs text-gray-100">{isPlaying ? "Tocando agora" : "Pausado"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Barra de progresso */}
                        <div className="space-y-1">
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
                        // List View
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

      <canvas ref={colorAnalysisCanvasRef} className="hidden" />

      {/* Create Post Modal */}
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
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNewPostContent(e.target.value)
                    }
                  }}
                  maxLength={500}
                ></textarea>
                <div className="text-right text-xs text-gray-500 mt-1">{newPostContent.length}/500 caracteres</div>
              </div>

              {/* No modal de criar post, substitua a seção de preview de mídia por: */}
              {newPostMedia && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {newPostMediaType === "image" ? (
                      <img
                        src={newPostMedia || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : newPostMediaType === "video" ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    ) : newPostMediaType === "youtube" ? (
                      <img
                        src={newPostMedia || "/placeholder.svg"}
                        alt="YouTube thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {newPostMediaType === "image" && "Imagem anexada"}
                      {newPostMediaType === "video" && "Vídeo anexado"}
                      {newPostMediaType === "youtube" &&
                        (extractYouTubeId(newPostYoutubeUrl)
                          ? `Vídeo: ${
                              newPostYoutubeUrl.includes("v=")
                                ? decodeURIComponent(newPostYoutubeUrl.split("v=")[1].split("&")[0])
                                : "Vídeo do YouTube"
                            }`
                          : "Vídeo do YouTube anexado")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => {
                          // Lógica para editar mídia
                          if (newPostMediaType === "youtube") {
                            setShowYoutubeInput(true)
                          } else {
                            postMediaInputRef.current?.click()
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja remover este anexo?")) {
                            setNewPostMedia(null)
                            setNewPostMediaType(null)
                            setNewPostYoutubeUrl("")
                            setVideoDuration(null)
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja remover este anexo?")) {
                        setNewPostMedia(null)
                        setNewPostMediaType(null)
                        setNewPostYoutubeUrl("")
                        setVideoDuration(null)
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600"
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

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="w-5 h-5" />
                </Button>
                <h3 className="text-lg font-semibold">Edit profile</h3>
              </div>
              <Button
                onClick={handleEditProfileSave}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
              >
                Save
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cover Image */}
              <div className="relative">
                <div
                  className="relative h-32 rounded-xl overflow-hidden bg-gray-200"
                  style={{
                    background:
                      tempCoverImage && tempCoverImage !== "/placeholder.svg?height=192&width=768" && !tempCoverRemoved
                        ? "none"
                        : autoGradient || "linear-gradient(to-r, #3b82f6, #8b5cf6)",
                  }}
                >
                  {tempCoverImage && tempCoverImage !== "/placeholder.svg?height=192&width=768" && !tempCoverRemoved ? (
                    <img
                      src={tempCoverImage || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2">
                    <button
                      onClick={() => tempCoverInputRef.current?.click()}
                      className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Upload className="w-5 h-5 text-white" />
                    </button>
                    {tempCoverImage &&
                      tempCoverImage !== "/placeholder.svg?height=192&width=768" &&
                      !tempCoverRemoved && (
                        <button
                          onClick={() => setShowRemoveCoverConfirmModal(true)}
                          className="w-10 h-10 bg-red-500/70 hover:bg-red-600/80 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      )}
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage src={tempAvatarImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl"></AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => tempAvatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Upload className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full border-gray-300 rounded-lg"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editingBio}
                    onChange={(e) => {
                      if (e.target.value.length <= 120) {
                        setEditingBio(e.target.value)
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Tell us about yourself"
                    maxLength={120}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">{editingBio.length}/120 caracteres</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    value={editingLocation}
                    onChange={(e) => setEditingLocation(e.target.value)}
                    className="w-full border-gray-300 rounded-lg"
                    placeholder="Your location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <Input
                    value={editingWebsite}
                    onChange={(e) => setEditingWebsite(e.target.value)}
                    className="w-full border-gray-300 rounded-lg"
                    placeholder="Your website"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Modal */}
      {showYouTubeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-lg font-semibold truncate flex-1">{currentVideoData?.title || "Assistir vídeo"}</h3>
              <Button variant="ghost" size="sm" onClick={closeYouTubeModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Lado esquerdo - Vídeo e informações */}
              <div className="flex-1 flex flex-col">
                <div className="aspect-video bg-black flex-shrink-0">
                  <iframe
                    src={getYouTubeEmbedUrl(currentYouTubeUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
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
                        <AvatarFallback>
                          {(currentVideoData?.author?.name || "A").charAt(0).toUpperCase()}
                        </AvatarFallback>
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
                </div>
              </div>

              {/* Lado direito - Comentários */}
              <div className="w-96 border-l bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                  <h3 className="font-medium text-lg">Comentários ({formatNumber(videoComments.length)})</h3>
                </div>

                <div className="p-4 border-b bg-white">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={avatarImage || "/placeholder.svg"} />
                      <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea
                        placeholder="Adicione um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full border rounded-lg p-2 text-sm resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {videoComments.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {videoComments.map((comment) => (
                        <li key={comment.id} className="p-4">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{comment.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-gray-500">{comment.timestamp}</span>
                              </div>
                              <p className="text-gray-800 text-sm mt-1">{comment.comment}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                <button className="hover:text-red-600 transition-colors flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  Curtir
                                </button>
                                <button className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  Responder
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Nenhum comentário ainda</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="w-[250px] h-[250px] rounded-full overflow-hidden">
              <img src={avatarImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
      {/* Remove Cover Confirmation Modal */}
      {showRemoveCoverConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Remover foto de capa</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover a imagem de capa? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowRemoveCoverConfirmModal(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setTempCoverRemoved(true)
                    setShowRemoveCoverConfirmModal(false)
                  }}
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">BILIBILI</span>
              </div>
              <p className="text-gray-600 text-sm">
                A plataforma definitiva para criadores de conteúdo compartilharem suas paixões e se conectarem com
                comunidades incríveis.
              </p>
              <div className="flex gap-3">
                <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                  <Music className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Explorar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Trending
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Comunidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Criador Studio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Monetização
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Parcerias
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Desenvolvedores
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2024 BILIBILI. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">Feito com ❤️ para criadores</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Todos os sistemas operacionais</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
