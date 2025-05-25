"use client"

import { useState } from "react"
import { Verified, Crown, Play, Star, Upload, Heart } from "lucide-react"

export interface UserProfile {
  name: string
  username: string
  bio: string
  verified: boolean
  location: string
  website: string
  joinDate: string
  stats: {
    followers: number
    following: number
    posts: number
    likes: number
  }
  level: number
  exp: number
  nextLevelExp: number
  badges: Array<{
    name: string
    icon: any
    color: string
    image: string
    rarity: string
  }>
  currentMusic: {
    title: string
    artist: string
    cover: string
    isPlaying: boolean
  }
  topMusic: {
    title: string
    artist: string
    cover: string
    playCount: number
  }
}

export interface Post {
  id: number
  type: "youtube" | "video" | "post" | "image"
  title: string
  content: string
  thumbnail?: string
  youtubeUrl?: string
  videoUrl?: string // For local videos
  duration?: string
  stats: {
    views?: number
    likes: number
    comments: number
    shares: number
  }
  timestamp: string
  category: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
}

export function useProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
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
    badges: [
      {
        name: "Criador Verificado",
        icon: Verified,
        color: "text-blue-500",
        image: "/placeholder.svg?height=64&width=64",
        rarity: "legendary",
      },
      {
        name: "Top Creator",
        icon: Crown,
        color: "text-yellow-500",
        image: "/placeholder.svg?height=64&width=64",
        rarity: "epic",
      },
      {
        name: "Milhão de Views",
        icon: Play,
        color: "text-red-500",
        image: "/placeholder.svg?height=64&width=64",
        rarity: "rare",
      },
      {
        name: "Expert em Anime",
        icon: Star,
        color: "text-purple-500",
        image: "/placeholder.svg?height=64&width=64",
        rarity: "epic",
      },
      {
        name: "Streamer Pro",
        icon: Upload,
        color: "text-green-500",
        image: "/placeholder.svg?height=64&width=64",
        rarity: "rare",
      },
      {
        name: "Community Hero",
        icon: Heart,
        color: "text-pink-500",
        image: "/placeholder.svg?height=64&width=64",
        rarity: "common",
      },
    ],
    currentMusic: {
      title: "Lofi Hip Hop Radio",
      artist: "ChilledCow",
      cover: "/placeholder.svg?height=64&width=64",
      isPlaying: true,
    },
    topMusic: {
      title: "Anime Opening Mix",
      artist: "Various Artists",
      cover: "/placeholder.svg?height=64&width=64",
      playCount: 1247,
    },
  })

  // Separar posts (texto, imagens, YouTube) de vídeos locais
  const [userPosts, setUserPosts] = useState<Post[]>([
    {
      id: 1001,
      type: "youtube",
      title: "Neow.ai - Brainrot Gang (Official Video)",
      content:
        "3 minutes of chaos, characters, and cinematic crime. Written, animated, edited and scored by one person. Welcome to my universe. https://www.youtube.com/watch?v=2D1rExarl4M",
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

  // Vídeos locais separados
  const [userVideos, setUserVideos] = useState<Post[]>([])

  const [coverImage, setCoverImage] = useState("/placeholder.svg?height=192&width=768")
  const [avatarImage, setAvatarImage] = useState("/placeholder.svg?height=128&width=128")

  // Função para adicionar vídeo local
  const addLocalVideo = (video: Post) => {
    setUserVideos((prev) => [video, ...prev])
  }

  // Função para adicionar post (incluindo YouTube)
  const addPost = (post: Post) => {
    setUserPosts((prev) => [post, ...prev])
  }

  return {
    userProfile,
    setUserProfile,
    userPosts,
    setUserPosts,
    userVideos,
    setUserVideos,
    coverImage,
    setCoverImage,
    avatarImage,
    setAvatarImage,
    addLocalVideo,
    addPost,
  }
}
