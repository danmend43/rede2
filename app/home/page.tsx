"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Imports dos novos componentes organizados
import Sidebar from "@/app/shared/components/sidebar"
import SearchBar from "@/app/shared/components/search-bar"
import VerificationBadge from "./components/verification-badge"

// Imports dos tipos e dados
import type { Post } from "./types"
import { communities, timelinePosts, shorts, trendingTopics, suggestedUsers } from "./data/mock-data"

const getLevelColors = (level: number) => {
  const tier = Math.floor(level / 10)
  const colorSchemes = [
    { bg: "bg-gradient-to-r from-yellow-300 to-yellow-500", text: "text-black" },
    { bg: "bg-gradient-to-r from-red-400 to-red-600", text: "text-white" },
    { bg: "bg-gradient-to-r from-blue-400 to-blue-600", text: "text-white" },
    { bg: "bg-gradient-to-r from-green-400 to-green-600", text: "text-white" },
    { bg: "bg-gradient-to-r from-purple-400 to-purple-600", text: "text-white" },
  ]
  return colorSchemes[tier] || { bg: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500", text: "text-white" }
}

// Skeleton Loader Component
const PostSkeletonComponent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false) // Adicionado para acessar o estado isDarkMode

  useEffect(() => {
    // Verifica o tema salvo no localStorage ao montar o componente
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }
  }, [])

  return (
    <div
      className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border shadow-sm overflow-hidden mb-4 p-4 animate-pulse`}
    >
      {/* Header skeleton */}
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"}`}></div>
        <div className="flex-1">
          <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-32 mb-1`}></div>
          <div className={`h-3 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-20`}></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-full`}></div>
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-3/4`}></div>
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-1/2`}></div>
      </div>

      {/* Image skeleton */}
      <div className={`h-64 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded-2xl mb-4`}></div>

      {/* Stats skeleton */}
      <div
        className={`flex items-center space-x-8 pt-2 border-t ${isDarkMode ? "border-[#0f0f0f]" : "border-gray-100"}`}
      >
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-12`}></div>
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-12`}></div>
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-12`}></div>
        <div className={`h-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"} rounded w-8`}></div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCommunitiesMenuOpen, setIsCommunitiesMenuOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState(timelinePosts)
  const [visiblePosts, setVisiblePosts] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const shortsScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const suggestionsScrollRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("best")
  const [profileImage, setProfileImage] = useState("/images/new-profile.jpg")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }

    // Carregar foto salva
    const savedImage = localStorage.getItem("profileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }

    // Escutar mudanças na foto de perfil
    const handleProfileImageChange = (event: CustomEvent) => {
      setProfileImage(event.detail.newImage)
    }

    window.addEventListener("profileImageChanged", handleProfileImageChange as EventListener)

    return () => {
      window.removeEventListener("profileImageChanged", handleProfileImageChange as EventListener)
    }
  }, [])

  // Intersection Observer para carregar mais posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visiblePosts < posts.length && !isLoading) {
          setIsLoading(true)
          // Simula carregamento
          setTimeout(() => {
            setVisiblePosts((prev) => Math.min(prev + 3, posts.length))
            setIsLoading(false)
          }, 1000)
        }
      },
      {
        threshold: 1.0,
        rootMargin: "100px",
      },
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [visiblePosts, posts.length, isLoading])

  const closeAllMenus = () => {
    setIsCommunitiesMenuOpen(false)
    setIsSettingsMenuOpen(false)
  }

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const newPostObj: Post = {
        id: Date.now(),
        user: "Dan",
        avatar: profileImage, // Usar a foto atual do perfil
        time: "agora",
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        userLevel: 5,
        communityTag: "CAFÉ",
        verificationBadge: "blue",
        isSponsored: false,
      }
      setPosts([newPostObj, ...posts])
      setNewPost("")
    }
  }

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const followUser = (userId: number) => {
    console.log("Following user:", userId)
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`
    }
    return views.toString()
  }

  const scrollShortsRight = () => {
    if (shortsScrollRef.current) {
      shortsScrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      })
    }
  }

  const scrollShortsLeft = () => {
    if (shortsScrollRef.current) {
      shortsScrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (shortsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = shortsScrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#0B0B0D] text-white" : "bg-gray-50 text-gray-900"} flex font-sans`}
    >
      {/* Left Sidebar */}
      <Sidebar isDarkMode={isDarkMode} communities={communities} currentPage="home" />

      {/* Menu de Configurações */}
      {isSettingsMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
          <div
            className={`fixed left-[76px] top-0 h-full w-80 ${
              isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"
            } border-r z-50 shadow-lg overflow-y-auto`}
          >
            <div className={`p-4 border-b ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} relative`}>
              <h2 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Menu
              </h2>
              <button
                onClick={() => setIsSettingsMenuOpen(false)}
                className={`p-2 ${
                  isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"
                } rounded-full absolute top-2 right-2 transition-colors`}
              >
                <i className={`bi bi-x text-xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}></i>
              </button>
            </div>

            <div className="p-4 space-y-1">
              {/* Seção Conta */}
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 px-2`}>
                  Conta
                </h3>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Adicionar conta da comunidade
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Trocar de conta
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Sair
                  </button>
                  <Link href="/settings">
                    <button
                      className={`w-full text-left px-3 py-2.5 rounded-lg ${
                        isDarkMode ? "bg-[#27272a] text-white" : "bg-gray-100 text-gray-900"
                      } transition-colors text-sm font-medium`}
                    >
                      Configurações
                    </button>
                  </Link>
                </div>
              </div>

              {/* Seção Suporte */}
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 px-2`}>
                  Suporte e Segurança
                </h3>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Central de Denúncias e Violações
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Seus direitos de privacidade
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Central de Ajuda</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Termos de Serviço</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Política de Privacidade</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Política de Cookies</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Seção Sobre */}
              <div className="mb-4">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 px-2`}>
                  Sobre
                </h3>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Sobre a plataforma
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Novidades e atualizações
                  </button>
                </div>
              </div>

              {/* Links de Política */}
              <div className={`pt-4 border-t ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}>
                <div className="text-center">
                  <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>© 2025 coronocorp</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-[76px]">
        {/* Search Bar */}
        <SearchBar isDarkMode={isDarkMode} placeholder="Pesquisar.." />

        {/* Main Content Area */}
        <div className="flex mt-[82px]">
          {/* Left Column */}
          <div className="w-[320px] fixed left-[76px] top-[82px] bottom-0 h-[calc(100vh-82px)] p-4 pt-4">
            {/* GitHub-style Profile Card */}
            <div
              className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} p-4 h-full rounded-2xl border shadow-sm overflow-y-auto`}
            >
              <div
                className={`flex items-center gap-3 mb-4 pb-4 border-b ${isDarkMode ? "border-[#21262d]" : "border-gray-200"}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={profileImage || "/placeholder.svg"} alt="Dan" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div
                    className={`font-semibold text-[15px] ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center`}
                  >
                    Dan
                    <VerificationBadge type="blue" />
                  </div>
                  <div className={`text-[13px] font-normal ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                    @dan
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                <a
                  href="#"
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium ${isDarkMode ? "text-white bg-[#21262d]" : "text-gray-900 bg-gray-100"} rounded-md`}
                >
                  <i className="bi bi-journal-text text-base"></i>
                  Feed
                </a>

                <a
                  href="#"
                  className={`flex items-center justify-between px-3 py-2 text-sm ${isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"} rounded-md transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <i className="bi bi-compass text-base"></i>
                    <div>
                      <div className="font-medium">Explorar</div>
                      <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>
                        +127 novidades hoje
                      </div>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </a>

                <a
                  href="#"
                  className={`flex items-center justify-between px-3 py-2 text-sm ${isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"} rounded-md transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <i className="bi bi-bookmark text-base"></i>
                    <div>
                      <div className="font-medium">Posts Salvos</div>
                      <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>
                        23 itens salvos
                      </div>
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className={`flex items-center gap-3 px-3 py-2 text-sm ${isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"} rounded-md transition-colors`}
                >
                  <i className="bi bi-heart text-base"></i>
                  <div>
                    <div className="font-medium">Curtidas</div>
                    <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>
                      Posts que você curtiu
                    </div>
                  </div>
                </a>

                <a
                  href="#"
                  className={`flex items-center justify-between px-3 py-2 text-sm ${isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"} rounded-md transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <i className="bi bi-people text-base"></i>
                    <div>
                      <div className="font-medium">Amigos Online</div>
                      <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>
                        156 amigos conectados
                      </div>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </a>

                <a
                  href="#"
                  className={`flex items-center gap-3 px-3 py-2 text-sm ${isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"} rounded-md transition-colors`}
                >
                  <i className="bi bi-graph-up-arrow text-base"></i>
                  <div>
                    <div className="font-medium">Trending</div>
                    <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>Tópicos em alta</div>
                  </div>
                </a>

                <a
                  href="#"
                  className={`flex items-center gap-3 px-3 py-2 text-sm ${isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"} rounded-md transition-colors`}
                >
                  <i className="bi bi-star text-base"></i>
                  <div>
                    <div className="font-medium">Favoritos</div>
                    <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>
                      Seus animes favoritos
                    </div>
                  </div>
                </a>

                {/* Rank */}
                <Link
                  href="/rank"
                  className={`flex items-center gap-3 px-3 py-2 text-sm ${
                    isDarkMode ? "text-[#e6edf3] hover:bg-[#21262d]" : "text-gray-700 hover:bg-gray-100"
                  } rounded-md transition-colors`}
                >
                  <i className="bi bi-trophy text-base"></i>
                  <div>
                    <div className="font-medium">Rank</div>
                    <div className={`text-xs ${isDarkMode ? "text-[#7d8590]" : "text-gray-500"}`}>
                      Ranking da comunidade
                    </div>
                  </div>
                </Link>
              </nav>
            </div>
          </div>

          {/* Middle Column */}
          <div className="flex-1 ml-[320px] mr-[370px] flex justify-center pt-4">
            <div className="w-full max-w-[630px] px-2">
              <div>
                {/* Filter Tabs */}
                <div
                  className={`mb-6 ${isDarkMode ? "bg-[#09090b] border-[#27272a] border" : "bg-white border border-gray-200"} p-4 rounded-2xl`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {/* Best */}
                      <button
                        onClick={() => setActiveFilter("best")}
                        className={`px-4 py-2 rounded-2xl font-semibold text-sm flex items-center space-x-1.5 transition-colors ${
                          activeFilter === "best"
                            ? "bg-[#00AEEC] hover:bg-[#0099CC] text-white"
                            : `${isDarkMode ? "bg-[#0B0B0D] hover:bg-[#27272a] text-[#00AEEC] border border-[#27272a]" : "bg-gray-50 hover:bg-gray-100 text-[#00AEEC] border border-gray-200"}`
                        }`}
                      >
                        <i className="bi bi-fire text-base"></i>
                        <span>Para você</span>
                      </button>

                      {/* Hot */}
                      <button
                        onClick={() => setActiveFilter("hot")}
                        className={`px-4 py-2 rounded-2xl font-semibold text-sm transition-colors ${
                          activeFilter === "hot"
                            ? "bg-[#00AEEC] hover:bg-[#0099CC] text-white"
                            : `${isDarkMode ? "bg-[#0B0B0D] hover:bg-[#27272a] text-[#00AEEC] border border-[#27272a]" : "bg-gray-50 hover:bg-gray-100 text-[#00AEEC] border border-gray-200"}`
                        }`}
                      >
                        Amigos
                      </button>

                      {/* trending */}
                      <button
                        onClick={() => setActiveFilter("trending")}
                        className={`px-4 py-2 rounded-2xl font-semibold text-sm transition-colors ${
                          activeFilter === "trending"
                            ? "bg-[#00AEEC] hover:bg-[#0099CC] text-white"
                            : `${isDarkMode ? "bg-[#0B0B0D] hover:bg-[#27272a] text-[#00AEEC] border border-[#27272a]" : "bg-gray-50 hover:bg-gray-100 text-[#00AEEC] border border-gray-200"}`
                        }`}
                      >
                        Em alta
                      </button>

                      {/* top */}
                      <button
                        onClick={() => setActiveFilter("top")}
                        className={`px-4 py-2 rounded-2xl font-semibold text-sm transition-colors ${
                          activeFilter === "top"
                            ? "bg-[#00AEEC] hover:bg-[#0099CC] text-white"
                            : `${isDarkMode ? "bg-[#0B0B0D] hover:bg-[#27272a] text-[#00AEEC] border border-[#27272a]" : "bg-gray-50 hover:bg-gray-100 text-[#00AEEC] border border-gray-200"}`
                        }`}
                      >
                        Novidades
                      </button>

                      
                    </div>

                    {/* View dropdown */}
                    <button
                      className={`flex items-center space-x-2 ${isDarkMode ? "text-white hover:bg-[#27272a]" : "text-gray-900 hover:bg-gray-100"} font-semibold text-sm px-3 py-2 rounded-lg transition-colors`}
                    >
                      <i className="bi bi-gear text-base"></i>
                    </button>
                  </div>
                </div>

                {/* Create Post */}
                <div
                  className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border p-4 mb-6 shadow-sm`}
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      {/* Foto do perfil */}
                      <div
                        className={`w-full h-full rounded-full overflow-hidden border-2 ${isDarkMode ? "border-[#27272a] bg-[#0B0B0D]" : "border-gray-200 bg-gray-50"}`}
                      >
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Perfil"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Indicador de progresso circular */}
                      {newPost.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Círculo de fundo */}
                          <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke={isDarkMode ? "#27272a" : "#e5e7eb"}
                            strokeWidth="4"
                          />
                          {/* Círculo de progresso */}
                          <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke={newPost.length >= 480 ? "#ef4444" : newPost.length >= 450 ? "#f59e0b" : "#00AEEC"}
                            strokeWidth="4"
                            strokeDasharray={`${(newPost.length / 500) * 301.59} 301.59`}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="No que você está pensando ?"
                        value={newPost}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setNewPost(e.target.value)
                          }
                        }}
                        rows={3}
                        className={`w-full px-0 py-2 border-0 resize-none bg-transparent ${isDarkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"} focus:outline-none text-base break-words overflow-wrap-anywhere`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                      className="text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#00AEEC" }}
                    >
                      Postar
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                      >
                        <i className={`bi bi-plus-lg text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}></i>
                      </button>
                      <button
                        className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                      >
                        <i className={`bi bi-image text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}></i>
                      </button>
                      <button
                        className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                      >
                        <i
                          className={`bi bi-camera-video text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline Posts */}
                <div className="space-y-6">
                  {posts.slice(0, visiblePosts).map((post, index) => (
                    <div key={post.id}>
                      {/* ESTRUTURA NORMAL PARA POSTS REGULARES - MODELO corono*/}
                      <div
                        className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow duration-200`}
                      >
                        {/* Header com avatar, nome e level na mesma linha */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div
                            className={`w-14 h-14 rounded-full p-0.5 flex-shrink-0 ${isDarkMode ? "border border-[#27272a]" : "border border-gray-300"}`}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden">
                              <img
                                src={post.avatar || "/placeholder.svg"}
                                alt={post.user}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-2">
                                <h4
                                  className={`font-semibold text-[15px] ${isDarkMode ? "text-white" : "text-gray-900"}`}
                                >
                                  {post.user}
                                </h4>
                                <VerificationBadge type={post.verificationBadge} />
                                {post.userLevel && (
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-xs font-bold text-white ${
                                      post.userLevel >= 40
                                        ? "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
                                        : post.userLevel >= 30
                                          ? "bg-gradient-to-r from-purple-400 to-purple-600"
                                          : post.userLevel >= 20
                                            ? "bg-gradient-to-r from-green-400 to-green-600"
                                            : post.userLevel >= 10
                                              ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                              : "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black"
                                    }`}
                                  >
                                    Lv {post.userLevel}
                                  </span>
                                )}
                                <span
                                  className={`text-[13px] font-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {post.time}
                                </span>
                              </div>
                              <span
                                className={`text-[12px] font-normal ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                              >
                                @{post.user.toLowerCase().replace(/\s+/g, "")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <p
                          className={`${isDarkMode ? "text-gray-300" : "text-gray-800"} text-[15px] leading-[1.3] mb-4 font-normal break-words overflow-wrap-anywhere`}
                        >
                          {post.content}
                        </p>

                        {/* Imagem */}
                        {post.image && (
                          <div className="mb-5 rounded-2xl overflow-hidden">
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post content"
                              className="w-full object-cover max-h-80 rounded-2xl"
                            />
                          </div>
                        )}

                        {/* Stats na parte inferior - horizontal */}
                        <div
                          className={`flex items-center space-x-8 pt-3 border-t ${isDarkMode ? "border-[#27272a]" : "border-gray-100"}`}
                        >
                          <button
                            className={`flex items-center space-x-2 text-[13px] py-2 font-normal ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
                          >
                            <i className="bi bi-chat text-base"></i>
                            <span>{post.comments}</span>
                          </button>

                          <button
                            className={`flex items-center space-x-2 text-[13px] py-2 font-normal ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
                          >
                            <i className="bi bi-arrow-repeat text-base"></i>
                            <span>{post.shares}</span>
                          </button>

                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center space-x-2 text-[13px] py-2 font-normal ${
                              post.isLiked
                                ? "text-[#00AEEC]"
                                : isDarkMode
                                  ? "text-gray-400 hover:text-gray-300"
                                  : "text-gray-500 hover:text-gray-700"
                            } transition-colors`}
                          >
                            <i className={`bi bi-heart${post.isLiked ? "-fill" : ""} text-base`}></i>
                            <span>{post.likes}</span>
                          </button>

                          <button
                            className={`flex items-center space-x-2 text-sm py-2 font-medium ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
                          >
                            <i className="bi bi-share text-base"></i>
                          </button>
                        </div>
                      </div>

                      {/* Trending Now - Shorts Section após o 3º post */}
                      {index === 2 && (
                        <div
                          className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border p-6 mb-6 shadow-sm relative overflow-hidden mt-6`}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <i className="bi bi-play-circle text-xl" style={{ color: "#00AEEC" }}></i>
                              <h3
                                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} tracking-tight`}
                              >
                                Trending Now
                              </h3>
                            </div>
                            <button
                              className={`text-sm font-semibold ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#27272a]`}
                            >
                              Ver todos
                            </button>
                          </div>

                          <div className="relative">
                            {/* Left Arrow */}
                            {canScrollLeft && (
                              <button
                                onClick={scrollShortsLeft}
                                className={`absolute left-0 top-[190px] transform -translate-y-1/2 w-12 h-12 rounded-full ${isDarkMode ? "bg-[#27272a]/90 hover:bg-[#3a3a3a]/90 text-white" : "bg-white/90 hover:bg-gray-50/90 text-gray-900"} shadow-xl flex items-center justify-center transition-all z-20 border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} backdrop-blur-sm`}
                              >
                                <i className="bi bi-chevron-left text-xl"></i>
                              </button>
                            )}

                            {/* Right Arrow */}
                            {canScrollRight && (
                              <button
                                onClick={scrollShortsRight}
                                className={`absolute right-0 top-[190px] transform -translate-y-1/2 w-12 h-12 rounded-full ${isDarkMode ? "bg-[#27272a]/90 hover:bg-[#3a3a3a]/90 text-white" : "bg-white/90 hover:bg-gray-50/90 text-gray-900"} shadow-xl flex items-center justify-center transition-all z-20 border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} backdrop-blur-sm`}
                              >
                                <i className="bi bi-chevron-right text-xl"></i>
                              </button>
                            )}

                            <div
                              ref={shortsScrollRef}
                              onScroll={handleScroll}
                              className="flex space-x-4 overflow-x-auto pb-4 px-2"
                              style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                scrollBehavior: "smooth",
                              }}
                            >
                              {shorts.map((short, index) => (
                                <div key={short.id} className="flex-shrink-0 w-[240px] cursor-pointer group">
                                  <div className="relative overflow-hidden rounded-xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-lg">
                                    <img
                                      src={short.thumbnail || "/placeholder.svg"}
                                      alt={short.title}
                                      className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                    />

                                    {/* Views Counter - Top of image */}
                                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md transition-all duration-300 group-hover:bg-black/80">
                                      {formatViews(short.views)}
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/70"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sugestões de Amigos - Carrossel Horizontal após o 4º post */}
                      {index === 3 && (
                        <div
                          className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border shadow-sm p-6 mt-6`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3
                              className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"} tracking-tight flex items-center`}
                            >
                              <i className="bi bi-person-plus text-lg mr-2" style={{ color: "#00AEEC" }}></i>
                              Sugestões para você
                            </h3>
                            <button
                              className={`text-sm font-semibold ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
                              style={{ color: "#00AEEC" }}
                            >
                              Ver todas
                            </button>
                          </div>

                          <div className="relative">
                            {/* Left Arrow */}
                            <button
                              onClick={() => {
                                if (suggestionsScrollRef.current) {
                                  suggestionsScrollRef.current.scrollBy({
                                    left: -200,
                                    behavior: "smooth",
                                  })
                                }
                              }}
                              className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full ${isDarkMode ? "bg-[#27272a]/90 hover:bg-[#3a3a3a]/90 text-white" : "bg-white/90 hover:bg-gray-50/90 text-gray-900"} shadow-xl flex items-center justify-center transition-all z-20 border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} backdrop-blur-sm`}
                            >
                              <i className="bi bi-chevron-left text-lg"></i>
                            </button>

                            {/* Right Arrow */}
                            <button
                              onClick={() => {
                                if (suggestionsScrollRef.current) {
                                  suggestionsScrollRef.current.scrollBy({
                                    left: 200,
                                    behavior: "smooth",
                                  })
                                }
                              }}
                              className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full ${isDarkMode ? "bg-[#27272a]/90 hover:bg-[#3a3a3a]/90 text-white" : "bg-white/90 hover:bg-gray-50/90 text-gray-900"} shadow-xl flex items-center justify-center transition-all z-20 border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} backdrop-blur-sm`}
                            >
                              <i className="bi bi-chevron-right text-lg"></i>
                            </button>

                            <div
                              ref={suggestionsScrollRef}
                              className="flex space-x-4 overflow-x-auto pb-2 px-2"
                              style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                              }}
                            >
                              {suggestedUsers.map((user) => (
                                <div
                                  key={user.id}
                                  className={`flex-shrink-0 w-[140px] p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C]" : "border-gray-200 bg-gray-50"} text-center`}
                                >
                                  <div
                                    className={`w-12 h-12 rounded-full p-0.5 mx-auto mb-2 ${isDarkMode ? "border border-[#27272a]" : "border border-gray-300"}`}
                                  >
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                      <img
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center mb-1">
                                    <h5
                                      className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-gray-900"} tracking-tight truncate`}
                                    >
                                      {user.name}
                                    </h5>
                                    <VerificationBadge type={user.verificationBadge} />
                                  </div>

                                  <p
                                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-3 truncate`}
                                  >
                                    {user.mutualFriends} em comum
                                  </p>

                                  <button
                                    onClick={() => followUser(user.id)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                  >
                                    Seguir
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Load More Trigger - só aparece quando há mais posts */}
                {visiblePosts < posts.length && <div ref={loadMoreRef} className="h-1 w-full"></div>}

                {/* Loading Skeletons - só aparece quando está carregando */}
                {isLoading && (
                  <div className="space-y-6 mt-6">
                    <PostSkeletonComponent />
                    <PostSkeletonComponent />
                    <PostSkeletonComponent />
                  </div>
                )}

                {/* End of Posts */}
                {visiblePosts >= posts.length && (
                  <div className="text-center py-8">
                    <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      🔍 Você chegou ao fim! Explore novos conteúdos e trends em alta!
                    </div>
                    <button
                      className="mt-3 text-sm font-medium px-4 py-2 rounded-full transition-colors"
                      style={{ backgroundColor: "#00AEEC", color: "white" }}
                    >
                      Descobrir trends
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - SEM SCROLL */}
          <div className="w-[370px] p-4 pt-4 fixed right-0 top-[82px] bottom-0 overflow-y-auto">
            <div
              className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border p-4 mb-4`}
            >
              <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3 flex items-center`}>
                <i className="bi bi-graph-up-arrow text-base mr-2" style={{ color: "#00AEEC" }}></i>
                Trending
              </h4>
              <div className="space-y-2">
                {trendingTopics.slice(0, 3).map((topic, index) => (
                  <div
                    key={topic.id}
                    className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"} cursor-pointer transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {index + 1}º
                        </span>
                        <span className={`font-medium text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {topic.name}
                        </span>
                      </div>
                      {topic.trend === "up" && <i className="bi bi-graph-up-arrow text-xs text-green-500"></i>}
                    </div>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} ml-6`}>
                      {topic.posts.toLocaleString()} posts
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 text-xs font-medium hover:opacity-80" style={{ color: "#00AEEC" }}>
                Ver mais
              </button>
            </div>

            <div
              className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border p-4 mb-4`}
            >
              <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3 flex items-center`}>
                <i className="bi bi-person-plus text-base mr-2" style={{ color: "#00AEEC" }}></i>
                Quem seguir
              </h4>
              <div className="space-y-3">
                {suggestedUsers.slice(0, 2).map((user) => (
                  <div key={user.id} className="flex items-start space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full p-0.5 border ${isDarkMode ? "border-[#27272a]" : "border-gray-300"}`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h5 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} text-sm`}>
                              {user.name}
                            </h5>
                            <VerificationBadge type={user.verificationBadge} />
                          </div>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            @{user.name.toLowerCase()}
                          </p>
                        </div>
                        <button
                          className={`${isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} px-4 py-1.5 rounded-full text-sm font-semibold transition-colors`}
                        >
                          Seguir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="w-full mt-3 text-sm font-medium hover:opacity-80 transition-colors"
                style={{ color: "#00AEEC" }}
              >
                Ver mais
              </button>
            </div>

            <div className="text-gray-500 text-xs space-y-2">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="hover:underline">
                  Cookie Policy
                </a>
                <a href="#" className="hover:underline">
                  Accessibility
                </a>
                <a href="#" className="hover:underline">
                  Ads info
                </a>
                <a href="#" className="hover:underline">
                  More
                </a>
              </div>
              <p>© 2025 corono</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
