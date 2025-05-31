"use client"

import type React from "react"
import { Edit, X, Youtube, Menu } from "lucide-react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Bell,
  Upload,
  Eye,
  TrendingUp,
  Star,
  MessageCircle,
  Trophy,
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

import { SmartColorExtractor, type VibrantColor } from "@/lib/novalogica-gradiente"

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

export default function ProfilePage() {
  // Estados para o gradiente automático
  const [autoGradient, setAutoGradient] = useState<string | null>(null)
  const [dominantColors, setDominantColors] = useState<VibrantColor[]>([])

  // Adicionar um novo estado para o gradiente temporário no modal
  const [tempAutoGradient, setTempAutoGradient] = useState<string | null>(null)

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
  const [showAvatarPreview, setShowAvatarPreview] = useState(false)
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
  const [tempCoverRemoved, setTempCoverRemoved] = useState(false)

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

  // Estados para o menu dropdown
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
    // Definir gradiente temporário baseado no gradiente atual
    setTempAutoGradient(autoGradient)
  }, [userProfile, coverImage, avatarImage, autoGradient])

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
      }, 500)

      // Configura renovação automática do token a cada 50 minutos
      const refreshInterval = setInterval(
        async () => {
          if (savedRefreshToken) {
            await refreshSpotifyToken(savedRefreshToken)
          }
        },
        50 * 60 * 1000,
      )

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
      }, 500)

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
      }, 100)
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

  // Modificar a função handleTempAvatarImageChange para gerar gradiente temporário
  const handleTempAvatarImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setTempAvatarImage(imageUrl)
        // Gerar gradiente temporário para o modal
        extractTempDominantColors(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  // Adicionar função para extrair cores temporárias no modal
  const extractTempDominantColors = useCallback((imageUrl: string) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Redimensionar para análise mais rápida
      const maxSize = 300
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      const width = img.width * ratio
      const height = img.height * ratio

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)

      try {
        const colors = SmartColorExtractor.extractVibrantColors(imageData)
        generateTempAutoGradient(colors)
      } catch (error) {
        console.error("Erro na extração temporária:", error)
      }
    }

    img.src = imageUrl
  }, [])

  // Adicionar função para gerar gradiente temporário
  const generateTempAutoGradient = (colors: VibrantColor[]) => {
    if (colors.length === 0) {
      setTempAutoGradient("rgb(59, 130, 246)")
      return
    }

    // Usar a mesma lógica do gradiente principal
    const colorsWithScore = colors.map((color) => {
      const areaScore = Math.log(color.rawPixelCount + 1) * 20.0
      const saturationScore = Math.pow(color.saturation, 2) * 15.0
      const brightnessScore = color.brightness > 0.3 && color.brightness < 0.95 ? 10.0 : -10.0
      const isHighAreaHighSat = color.rawPixelCount > 1000 && color.saturation > 0.8
      const megaBoost = isHighAreaHighSat ? 100.0 : 0
      const isRedVibrant =
        ((color.hue >= 0 && color.hue <= 30) || (color.hue >= 330 && color.hue <= 360)) && color.saturation > 0.7
      const redBoost = isRedVibrant ? 30.0 : 0
      const isPurpleOrPink = color.hue >= 270 && color.hue <= 330 && color.saturation > 0.3
      const purpleBoost = isPurpleOrPink ? 80.0 : 0
      const isVibriantBlue = color.hue >= 180 && color.hue <= 270 && color.saturation > 0.15
      const blueBoost = isVibriantBlue ? 40.0 : 0
      const isGoodBlue = color.hue >= 200 && color.hue <= 240 && color.saturation > 0.25 && color.brightness > 0.3
      const goodBlueBoost = isGoodBlue ? 25.0 : 0
      const lowAreaPenalty = color.rawPixelCount < 100 ? -50.0 : 0
      const neutralPenalty = color.saturation < 0.5 ? -30.0 : 0
      const tooLightPenalty = color.brightness > 0.9 && color.saturation < 0.15 ? -80.0 : 0

      const finalScore =
        areaScore +
        saturationScore +
        brightnessScore +
        megaBoost +
        redBoost +
        purpleBoost +
        blueBoost +
        goodBlueBoost +
        lowAreaPenalty +
        neutralPenalty +
        tooLightPenalty

      return {
        ...color,
        score: finalScore,
      }
    })

    colorsWithScore.sort((a, b) => b.score - a.score)

    const primaryColor = colorsWithScore[0]

    // Para a capa, usar apenas uma cor (cor dominante)
    const dominantColor = `rgb(${Math.round(primaryColor.r)}, ${Math.round(primaryColor.g)}, ${Math.round(primaryColor.b)})`
    setAutoGradient(dominantColor)
  }

  const handleTempCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempCoverImage(e.target?.result as string)
        setTempCoverRemoved(false)
        // Limpar gradiente temporário quando uma imagem de capa for escolhida
        setTempAutoGradient(null)
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

  // Atualize a função handleEditProfileSave para salvar o gradiente:

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

    // Salvar o gradiente temporário como gradiente principal
    if (tempAutoGradient) {
      setAutoGradient(tempAutoGradient)
    }

    setTempCoverRemoved(false)
    setShowEditProfileModal(false)
  }

  const handleCancelEdit = () => {
    setEditingName(userProfile.name)
    setEditingBio(userProfile.bio)
    setEditingLocation(userProfile.location)
    setEditingWebsite(userProfile.website)
    setTempCoverImage(coverImage)
    setTempAvatarImage(avatarImage)
    setTempCoverRemoved(false)
    setTempAutoGradient(autoGradient)
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

  // Função para extrair cores dominantes usando a nova lógica
  const extractDominantColors = useCallback((imageUrl: string) => {
    const canvas = colorAnalysisCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Redimensionar para análise mais rápida
      const maxSize = 300
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      const width = img.width * ratio
      const height = img.height * ratio

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)

      try {
        const colors = SmartColorExtractor.extractVibrantColors(imageData)
        setDominantColors(colors)
        generateAutoGradient(colors)
      } catch (error) {
        console.error("Erro na extração:", error)
        setDominantColors([])
      }
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
      const maxSize = 300
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      try {
        const colors = SmartColorExtractor.extractVibrantColors(imageData)
        generateSpotifyGradient(colors)
      } catch (error) {
        console.error("Erro na extração do Spotify:", error)
      }
    }

    img.src = imageUrl
  }, [])

  // Função para gerar gradiente para o card do Spotify
  const generateSpotifyGradient = (colors: VibrantColor[]) => {
    if (colors.length === 0) {
      setSpotifyGradient("linear-gradient(to bottom left, rgb(29, 185, 84), rgb(25, 20, 20))")
      return
    }

    // Calcular scores para cada cor baseado na área, saturação e brilho
    const colorsWithScore = colors.map((color) => {
      // Área: Peso logarítmico para área (pixels)
      const areaScore = Math.log(color.rawPixelCount + 1) * 20.0

      // Saturação: Peso exponencial para saturação
      const saturationScore = Math.pow(color.saturation, 2) * 15.0

      // Brilho: Evitar muito escuro/claro
      const brightnessScore = color.brightness > 0.3 && color.brightness < 0.95 ? 10.0 : -10.0

      // BOOST para cores com muita área + alta saturação
      const isHighAreaHighSat = color.rawPixelCount > 1000 && color.saturation > 0.8
      const megaBoost = isHighAreaHighSat ? 100.0 : 0

      // BOOST para cores vermelhas/vibrantes específicas
      const isRedVibrant =
        ((color.hue >= 0 && color.hue <= 30) || (color.hue >= 330 && color.hue <= 360)) && color.saturation > 0.7
      const redBoost = isRedVibrant ? 30.0 : 0

      // BOOST para roxos/rosas/magentas
      const isPurpleOrPink = color.hue >= 270 && color.hue <= 330 && color.saturation > 0.3
      const purpleBoost = isPurpleOrPink ? 80.0 : 0

      // BOOST para azuis saturados
      const isVibriantBlue = color.hue >= 180 && color.hue <= 270 && color.saturation > 0.15
      const blueBoost = isVibriantBlue ? 40.0 : 0

      const finalScore = areaScore + saturationScore + brightnessScore + megaBoost + redBoost + purpleBoost + blueBoost

      return {
        ...color,
        score: finalScore,
      }
    })

    // Ordenar por score
    colorsWithScore.sort((a, b) => b.score - a.score)

    const primaryColor = colorsWithScore[0]
    const secondaryColor = colorsWithScore[1] || primaryColor

    // Criar versões mais escuras para o gradiente
    const darkPrimary = `rgb(${Math.round(primaryColor.r * 0.4)}, ${Math.round(primaryColor.g * 0.4)}, ${Math.round(primaryColor.b * 0.4)})`
    const lightSecondary = `rgb(${Math.round(secondaryColor.r * 0.6)}, ${Math.round(secondaryColor.g * 0.6)}, ${Math.round(secondaryColor.b * 0.6)})`

    const gradient = `linear-gradient(to bottom left, ${lightSecondary}, ${darkPrimary})`
    setSpotifyGradient(gradient)
  }

  // Função para gerar gradiente automático (apenas uma cor para a capa)
  const generateAutoGradient = (colors: VibrantColor[]) => {
    if (colors.length === 0) {
      setAutoGradient("rgb(59, 130, 246)")
      return
    }

    // Calcular scores para cada cor baseado na área, saturação e brilho
    const colorsWithScore = colors.map((color) => {
      // Área: Peso logarítmico para área (pixels)
      const areaScore = Math.log(color.rawPixelCount + 1) * 20.0

      // Saturação: Peso exponencial para saturação
      const saturationScore = Math.pow(color.saturation, 2) * 15.0

      // Brilho: Evitar muito escuro/claro
      const brightnessScore = color.brightness > 0.3 && color.brightness < 0.95 ? 10.0 : -10.0

      // BOOST para cores com muita área + alta saturação
      const isHighAreaHighSat = color.rawPixelCount > 1000 && color.saturation > 0.8
      const megaBoost = isHighAreaHighSat ? 100.0 : 0

      // BOOST para cores vermelhas/vibrantes específicas
      const isRedVibrant =
        ((color.hue >= 0 && color.hue <= 30) || (color.hue >= 330 && color.hue <= 360)) && color.saturation > 0.7
      const redBoost = isRedVibrant ? 30.0 : 0

      // BOOST para roxos/rosas/magentas
      const isPurpleOrPink = color.hue >= 270 && color.hue <= 330 && color.saturation > 0.3
      const purpleBoost = isPurpleOrPink ? 80.0 : 0

      // BOOST para azuis saturados
      const isVibriantBlue = color.hue >= 180 && color.hue <= 270 && color.saturation > 0.15
      const blueBoost = isVibriantBlue ? 40.0 : 0

      // BOOST extra para azuis com boa saturação
      const isGoodBlue = color.hue >= 200 && color.hue <= 240 && color.saturation > 0.25 && color.brightness > 0.3
      const goodBlueBoost = isGoodBlue ? 25.0 : 0

      // Penalidades
      const lowAreaPenalty = color.rawPixelCount < 100 ? -50.0 : 0
      const neutralPenalty = color.saturation < 0.5 ? -30.0 : 0
      const tooLightPenalty = color.brightness > 0.9 && color.saturation < 0.15 ? -80.0 : 0

      const finalScore =
        areaScore +
        saturationScore +
        brightnessScore +
        megaBoost +
        redBoost +
        purpleBoost +
        blueBoost +
        goodBlueBoost +
        lowAreaPenalty +
        neutralPenalty +
        tooLightPenalty

      return {
        ...color,
        score: finalScore,
      }
    })

    // Ordenar por score
    colorsWithScore.sort((a, b) => b.score - a.score)

    const primaryColor = colorsWithScore[0]

    // Para a capa, usar apenas uma cor (cor dominante)
    const dominantColor = `rgb(${Math.round(primaryColor.r)}, ${Math.round(primaryColor.g)}, ${Math.round(primaryColor.b)})`
    setAutoGradient(dominantColor)
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
              {/* User Menu Dropdown */}
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

                    {/* Settings Section */}
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

                    {/* Help Section */}
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

                    {/* Accessibility Section */}
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

                    {/* Display Section */}
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
                : autoGradient || "rgb(59, 130, 246)",
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
                      onClick={() => setShowAvatarPreview(true)}
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
                        ? spotifyGradient || "linear-gradient(to bottom left, rgb(29, 185, 84), rgb(25, 20, 20))"
                        : "linear-gradient(to bottom left, rgb(45, 55, 72), rgb(26, 32, 44))",
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
        <div className="px-6 pb-16">
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
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Posts Tab Content */}
            {activeTab === "posts" && (
              <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid-cols-1 gap-6"}`}
              >
                {userPosts.map((post) => (
                  <Card
                    key={post.id}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
                  >
                    {post.thumbnail && (
                      <div className={viewMode === "list" ? "w-1/3 relative" : "relative"}>
                        <img
                          src={post.thumbnail || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          onClick={() => {
                            if (post.type === "youtube" && post.youtubeUrl) {
                              window.open(post.youtubeUrl, "_blank")
                            }
                          }}
                        />
                        {(post.type === "video" || post.type === "youtube") && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center transition-all duration-300 hover:bg-black/70 hover:scale-110">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            {post.duration && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {post.duration}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className={`p-4 ${viewMode === "list" && post.thumbnail ? "w-2/3" : "w-full"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{post.author.name}</span>
                            {post.author.verified && <Verified className="w-3 h-3 text-blue-500" />}
                          </div>
                          <div className="text-xs text-gray-500">{post.timestamp}</div>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                          {post.stats.views !== undefined && (
                            <div className="flex items-center gap-1 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>{formatNumber(post.stats.views)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3" />
                            <span>{formatNumber(post.stats.likes)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MessageCircle className="w-3 h-3" />
                            <span>{formatNumber(post.stats.comments)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Videos Tab Content */}
            {activeTab === "videos" && (
              <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid-cols-1 gap-6"}`}
              >
                {userPosts
                  .filter((post) => post.type === "video" || post.type === "youtube")
                  .map((post) => (
                    <Card
                      key={post.id}
                      className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
                    >
                      {post.thumbnail && (
                        <div className={viewMode === "list" ? "w-1/3 relative" : "relative"}>
                          <img
                            src={post.thumbnail || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                            onClick={() => {
                              if (post.type === "youtube" && post.youtubeUrl) {
                                window.open(post.youtubeUrl, "_blank")
                              }
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center transition-all duration-300 hover:bg-black/70 hover:scale-110">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            {post.duration && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {post.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <CardContent className={`p-4 ${viewMode === "list" && post.thumbnail ? "w-2/3" : "w-full"}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{post.author.name}</span>
                              {post.author.verified && <Verified className="w-3 h-3 text-blue-500" />}
                            </div>
                            <div className="text-xs text-gray-500">{post.timestamp}</div>
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-500">
                            <div className="flex items-center gap-1 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>{formatNumber(post.stats.views || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="w-3 h-3" />
                              <span>{formatNumber(post.stats.likes)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <MessageCircle className="w-3 h-3" />
                              <span>{formatNumber(post.stats.comments)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {/* Collections Tab Content */}
            {activeTab === "collections" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.length === 0 ? (
                  <div className="col-span-3 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Grid3X3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma coleção ainda</h3>
                    <p className="text-gray-600 mb-4">Crie coleções para organizar seus conteúdos favoritos</p>
                    <Button>Criar coleção</Button>
                  </div>
                ) : (
                  collections.map((collection) => (
                    <Card key={collection.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={collection.cover || "/placeholder.svg"}
                          alt={collection.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <h3 className="text-white font-bold text-lg">{collection.name}</h3>
                          <p className="text-gray-200 text-sm">{collection.itemCount} itens</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Achievements Tab Content */}
            {activeTab === "achievements" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.length === 0 ? (
                  <div className="col-span-3 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma conquista ainda</h3>
                    <p className="text-gray-600 mb-4">Continue interagindo para desbloquear conquistas</p>
                    <Button>Explorar desafios</Button>
                  </div>
                ) : (
                  achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`border-2 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} shadow-lg`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${
                              achievement.unlocked ? "bg-yellow-100" : "bg-gray-100"
                            }`}
                          >
                            <achievement.icon
                              className={`w-6 h-6 ${achievement.unlocked ? "text-yellow-600" : "text-gray-400"}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  achievement.rarity === "lendário"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : achievement.rarity === "épico"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {achievement.rarity}
                              </div>
                              <span className="text-xs text-gray-500">
                                {achievement.unlocked ? "Desbloqueado" : "Bloqueado"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-lg font-bold text-gray-900">BILIBILI</span>
              </div>
              <p className="text-gray-600 text-sm">
                A plataforma definitiva para criadores de conteúdo compartilharem suas paixões e se conectarem com suas
                comunidades.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Imprensa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Central de ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Diretrizes da comunidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Termos de serviço
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Política de privacidade
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Conecte-se</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 BILIBILI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Canvas para análise de cores */}
      <canvas ref={colorAnalysisCanvasRef} className="hidden" />

      {/* Avatar Preview Modal */}
      {showAvatarPreview && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAvatarPreview(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl">
              <img src={avatarImage || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Criar novo post</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={avatarImage || "/placeholder.svg"} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{userProfile.name}</div>
                    <div className="text-sm text-gray-600">Público</div>
                  </div>
                </div>

                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="O que você está pensando?"
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Categoria:</span>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {newPostMedia && (
                  <div className="relative">
                    {newPostMediaType === "image" && (
                      <img
                        src={newPostMedia || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    {newPostMediaType === "video" && (
                      <div className="relative">
                        <video src={newPostMedia} className="w-full h-32 object-cover rounded-lg" controls />
                        {videoDuration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {videoDuration}
                          </div>
                        )}
                      </div>
                    )}
                    {newPostMediaType === "youtube" && (
                      <div className="relative">
                        <img
                          src={newPostMedia || "/placeholder.svg"}
                          alt="YouTube thumbnail"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        {videoDuration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {videoDuration}
                          </div>
                        )}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewPostMedia(null)
                        setNewPostMediaType(null)
                        setVideoDuration(null)
                        setNewPostYoutubeUrl("")
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {showYoutubeInput && (
                  <div className="space-y-2">
                    <Input
                      value={newPostYoutubeUrl}
                      onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                      placeholder="Cole o link do YouTube aqui..."
                      className="w-full"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowYoutubeInput(false)
                        setNewPostYoutubeUrl("")
                        if (newPostMediaType === "youtube") {
                          setNewPostMedia(null)
                          setNewPostMediaType(null)
                          setVideoDuration(null)
                        }
                      }}
                      className="text-gray-500"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => postMediaInputRef.current?.click()}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Mídia
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowCreatePostModal(false)} className="text-gray-600">
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Publicar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Editar perfil</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Cover Image Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Imagem de capa</label>
                  <div
                    className="relative h-32 rounded-lg overflow-hidden cursor-pointer group"
                    style={{
                      background:
                        tempCoverImage &&
                        tempCoverImage !== "/placeholder.svg?height=192&width=768" &&
                        !tempCoverRemoved
                          ? "none"
                          : tempAutoGradient || autoGradient || "rgb(59, 130, 246)",
                    }}
                    onClick={() => tempCoverInputRef.current?.click()}
                  >
                    {tempCoverImage &&
                    tempCoverImage !== "/placeholder.svg?height=192&width=768" &&
                    !tempCoverRemoved ? (
                      <>
                        <img
                          src={tempCoverImage || "/placeholder.svg"}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                        Alterar capa
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => tempCoverInputRef.current?.click()}
                      className="text-xs"
                    >
                      Escolher arquivo
                    </Button>
                    {tempCoverImage && tempCoverImage !== "/placeholder.svg?height=192&width=768" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTempCoverRemoved(true)
                          setTempCoverImage("/placeholder.svg?height=192&width=768")
                        }}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Foto do perfil</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
                        <Avatar className="w-full h-full border-2 border-white">
                          <AvatarImage src={tempAvatarImage || "/placeholder.svg"} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => tempAvatarInputRef.current?.click()}
                      className="text-sm"
                    >
                      Alterar foto
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editingBio}
                      onChange={(e) => setEditingBio(e.target.value)}
                      placeholder="Conte um pouco sobre você..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                    <Input
                      value={editingLocation}
                      onChange={(e) => setEditingLocation(e.target.value)}
                      placeholder="Sua localização"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <Input
                      value={editingWebsite}
                      onChange={(e) => setEditingWebsite(e.target.value)}
                      placeholder="Seu website"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Social Platforms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Plataformas conectadas</label>
                  <div className="grid grid-cols-2 gap-3">
                    {socialPlatforms.map((platform) => (
                      <div
                        key={platform.name}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          platform.connected ? "border-green-200 bg-green-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <platform.icon className={`w-4 h-4 ${platform.color}`} />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={platform.onToggle}
                          className={`text-xs ${
                            platform.connected ? "text-red-600 hover:text-red-700" : "text-blue-600 hover:text-blue-700"
                          }`}
                        >
                          {platform.connected ? "Desconectar" : "Conectar"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handleCancelEdit} className="text-gray-600">
                    Cancelar
                  </Button>
                  <Button onClick={handleEditProfileSave} className="bg-blue-600 hover:bg-blue-700">
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
