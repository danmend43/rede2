"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Import components
import Overview from "@/app/community/components/overview"
import Feed from "@/app/community/components/feed"
import Highlights from "@/app/community/components/highlights"

import Sidebar from "@/app/shared/components/sidebar"
import SearchBar from "@/app/shared/components/search-bar"

interface Member {
  id: number
  name: string
  avatar: string
  status: string
  verified?: boolean
  activity?: {
    type: "assistindo" | "lendo" | "jogando" | "ouvindo"
    content: string
    details?: string
    time?: string
  }
}

interface Community {
  id: number
  name: string
  avatar: string
  coverImage: string
  members: number
  online: number
  description: string
  createdAt: string
  isPublic: boolean
  category: string
  activeMembers: number
}

interface CommunityRoom {
  id: number
  name: string
  description: string
  memberCount: number
  isActive: boolean
  lastActivity: string
}

const members: Member[] = [
  {
    id: 1,
    name: "KawaiiDream",
    avatar: "/images/anime-profiles/blonde-cat-girl.jpg",
    status: "online",
    verified: true,
    activity: {
      time: "@KawaiiDream",
    },
  },
  {
    id: 2,
    name: "BlueEyedHero",
    avatar: "/images/anime-profiles/green-hair-girl.jpg",
    status: "online",
    activity: { 
      time: "@BlueEyedHero",
    },
  },
  {
    id: 3,
    name: "GreenGoddess",
    avatar: "/images/anime-profiles/adventure-boy.jpg",
    status: "online",
    verified: true,
    activity: { 
      time: "@GreenGoddess",
    },
  },
  {
    id: 4,
    name: "CapGirl",
    avatar: "/images/anime-profiles/neon-girl.jpg",
    status: "online",
    verified: true,
    activity: { 
      time: "@CapGirl",
    },
  },
  {
    id: 5,
    name: "MagicalStar",
    avatar: "/images/anime-profiles/pink-hair-cats.jpg",
    status: "online",
    activity: { 
      time: "@MagicalStar",
    },
  },
]

const communityRooms: CommunityRoom[] = [
  {
    id: 1,
    name: "Chat Geral",
    description: "Discussões gerais sobre anime e mangá",
    memberCount: 156,
    isActive: true,
    lastActivity: "há 2 min",
  },
  {
    id: 2,
    name: "Discussão de Animes",
    description: "Fale sobre seus animes favoritos",
    memberCount: 89,
    isActive: true,
    lastActivity: "há 5 min",
  },
  {
    id: 3,
    name: "Mangás e Light Novels",
    description: "Para os amantes da leitura",
    memberCount: 67,
    isActive: true,
    lastActivity: "há 12 min",
  },
  {
    id: 4,
    name: "Fanarts e Criações",
    description: "Compartilhe suas criações artísticas",
    memberCount: 43,
    isActive: false,
    lastActivity: "há 1h",
  },
  {
    id: 5,
    name: "Eventos e Anúncios",
    description: "Informações sobre eventos da comunidade",
    memberCount: 234,
    isActive: true,
    lastActivity: "há 30 min",
  },
]

const communities: Community[] = [
  {
    id: 1,
    name: "Anime Café",
    avatar: "/images/anime-profiles/cozy-girl.jpg",
    coverImage: "/images/anime-profiles/cozy-girl.jpg",
    members: 8200,
    online: 156,
    description:
      "Discussões relaxantes sobre anime. Nossa comunidade é um espaço dedicado aos fãs de anime onde você pode compartilhar suas paixões, descobrir novos títulos e fazer amizades duradouras.",
    createdAt: "15 de mar. de 2022",
    isPublic: true,
    category: "Entretenimento",
    activeMembers: 89,
  },
  {
    id: 2,
    name: "Gawr gura Club",
    avatar: "/images/anime-profiles/flower-girl.jpg",
    coverImage: "/images/anime-profiles/flower-girl.jpg",
    members: 11200,
    online: 203,
    description:
      "Nossa comunidade é um espaço dedicado aos fãs da Gawr Gura — a lendária tubarãozinha da Hololive que conquistou o coração de milhões com seu carisma, humor e fofura!",
    createdAt: "8 de jan. de 2021",
    isPublic: true,
    category: "Arte e Cultura",
    activeMembers: 142,
  },
  {
    id: 3,
    name: "Demon Slayer BR",
    avatar: "/images/anime-profiles/sporty-cat-girl.jpg",
    coverImage: "/images/anime-profiles/sporty-cat-girl.jpg",
    members: 12500,
    online: 189,
    description: "Comunidade brasileira de Demon Slayer. Técnicas de respiração, caça aos demônios e muito mais!",
    createdAt: "31 de jul. de 2020",
    isPublic: true,
    category: "Anime e Mangá",
    activeMembers: 234,
  },
]

export default function CommunityPage() {
  const params = useParams()
  const router = useRouter()
  const communityId = Number(params.id)

  const [activeTab, setActiveTab] = useState("visao-geral")
  const [totalBoosts, setTotalBoosts] = useState(100)
  const [currentBoosts, setCurrentBoosts] = useState(10)
  const [level, setLevel] = useState(42)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [membersVisible, setMembersVisible] = useState(true)

  const [currentCommunity, setCurrentCommunity] = useState<Community>(() => {
    const found = communities.find((c) => c.id === communityId)
    return found ?? communities[0] // fallback to first community
  })

  const [isHoveringCover, setIsHoveringCover] = useState(false)

  // Load preferences and community data
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }

    // Find community by ID - sempre encontrar uma comunidade válida
    const community = communities.find((c) => c.id === communityId) || communities[0]
    setCurrentCommunity(community)
  }, [communityId])

  useEffect(() => {
    // Adicionar Bootstrap Icons CSS se não estiver presente
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
      document.head.appendChild(link)
    }
  }, [])

  const switchCommunity = (community: Community) => {
    setCurrentCommunity(community)
    router.push(`/community/${community.id}`)
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <Feed isDarkMode={isDarkMode} />
      case "destaque":
        return <Highlights isDarkMode={isDarkMode} />
      case "salas":
        return (
          <div className="flex-1 space-y-6">
            <div
              className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-6`}
            >
              <h2
                className={`text-xl font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"} mb-6 flex items-center`}
              >
                <i className="bi bi-chat text-purple-500 me-2"></i>
                Salas de Chat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communityRooms.map((room) => (
                  <Link key={room.id} href={`/community/${communityId}/chat/${room.id}`}>
                    <div
                      className={`group relative overflow-hidden rounded-xl border ${isDarkMode ? "border-[#27272a] hover:border-[#3f3f46]" : "border-gray-200 hover:border-gray-300"} transition-all duration-300 hover:shadow-lg cursor-pointer`}
                    >
                      {/* Cover Image */}
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={`/images/anime-profiles/${["cozy-girl", "flower-girl", "blonde-cat-girl", "green-hair-girl", "adventure-boy"][room.id % 5]}.jpg`}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              room.isActive ? "bg-green-500/90 text-white" : "bg-gray-500/90 text-white"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${room.isActive ? "bg-white" : "bg-gray-300"}`}></div>
                            <span>{room.isActive ? "Ativo" : "Inativo"}</span>
                          </div>
                        </div>

                        {/* Room Title */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-semibold text-lg leading-tight">{room.name}</h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-4 ${isDarkMode ? "bg-[#09090b]" : "bg-white"}`}>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-3 line-clamp-2`}>
                          {room.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs">
                            <span
                              className={`flex items-center space-x-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                            >
                              <i className="bi bi-people me-1"></i>
                              <span>{room.memberCount} membros</span>
                            </span>
                          </div>
                          <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                            {room.lastActivity}
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div
                        className={`absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-xl transition-all duration-300 pointer-events-none`}
                      ></div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Create New Room Button */}
              <div className="mt-8 text-center">
                <button
                  className={`inline-flex items-center space-x-2 px-6 py-3 ${isDarkMode ? "bg-[#27272a] hover:bg-[#3f3f46] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"} rounded-xl font-medium transition-colors`}
                >
                  <i className={`bi bi-plus ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}></i>
                  <span>Criar Nova Sala</span>
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return <Overview currentCommunity={currentCommunity} isDarkMode={isDarkMode} />
    }
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#0C0C0C] text-white" : "bg-gray-50 text-gray-900"} flex font-sans`}
    >
      {/* Left Sidebar */}
      <Sidebar isDarkMode={isDarkMode} communities={communities} currentPage="community" />

      {/* Main Content */}
      <div className="flex-1 ml-[76px]">
        {/* Search Bar */}
        <div
          className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} p-4 border-b fixed top-0 left-[76px] right-0 z-30`}
        >
          <SearchBar isDarkMode={isDarkMode} placeholder="Pesquisar na comunidade..." />
        </div>

        {/* Main Content Area */}
        <div className="flex mt-[88px]">
          {/* Left Column - Community Info */}
          <div
            className="w-[380px] p-4 fixed left-[76px] top-[72px] bottom-0 overflow-y-auto"
            style={{ transition: "width 0.2s ease-out" }}
          >
            <div
              className="rounded-xl overflow-hidden mb-4 relative cursor-pointer"
              onMouseEnter={() => setIsHoveringCover(true)}
              onMouseLeave={() => setIsHoveringCover(false)}
            >
              <div className="overflow-hidden">
                <img
                  src={currentCommunity.coverImage || "/placeholder.svg?height=180&width=380"}
                  alt={currentCommunity.name}
                  className={`w-full h-[180px] object-cover transition-transform duration-500 ${isHoveringCover ? "scale-110" : "scale-100"}`}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h1 className="text-2xl font-bold tracking-tight">{currentCommunity.name}</h1>
                <div className="flex items-center space-x-2 text-sm mt-1">
                  <span>{currentCommunity.members.toLocaleString()} membros</span>
                  <span>•</span>
                  <span>{currentCommunity.online} online</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-purple-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold leading-none">{level}</div>
                    <div className="text-xs opacity-90 uppercase tracking-wide">Nível</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Boost Card */}
              <div
                className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-2.5 h-2.5 text-white"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <span className={`font-medium text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Impulsionamento
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600 font-medium text-sm">
                      {currentBoosts}/{totalBoosts}
                    </span>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3"
                      >
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                      </svg>
                      <span>Boost</span>
                    </button>
                  </div>
                </div>
                <div className={`w-full ${isDarkMode ? "bg-[#27272a]" : "bg-gray-200"} rounded-full h-2`}>
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(currentBoosts / totalBoosts) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Community Info Card */}
              <div
                className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-4`}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                      Sobre a Comunidade
                    </h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed mb-3`}>
                      {currentCommunity.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <svg
                          className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v9a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1h-2"
                          ></path>
                        </svg>
                        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Criada em {currentCommunity.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {currentCommunity.isPublic ? "Pública" : "Privada"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          ></path>
                        </svg>
                        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {currentCommunity.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`grid grid-cols-2 gap-4 pt-3 border-t ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}
                  >
                    <div>
                      <div className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {currentCommunity.members.toLocaleString()}
                      </div>
                      <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Membros</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold text-green-500`}>{currentCommunity.online}</div>
                      <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Online agora</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div
                className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-4`}
              >
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3`}>
                  Estatísticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>156</div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Posts</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>89%</div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Atividade</div>
                  </div>
                </div>
              </div>

              {/* Links da Comunidade */}
              <div
                className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-4`}
              >
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3`}>
                  Links da Comunidade
                </h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    <span>📚</span>
                    <span>Wiki da Comunidade</span>
                  </a>
                  <a
                    href="#"
                    className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    <span>💬</span>
                    <span>Discord Oficial</span>
                  </a>
                  <a
                    href="#"
                    className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    <span>🎨</span>
                    <span>Galeria de Fanarts</span>
                  </a>
                  <a
                    href="#"
                    className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    <span>📖</span>
                    <span>Fandom Wiki</span>
                  </a>
                </div>
              </div>

              {/* Tags de Posts */}
              <div
                className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-4`}
              >
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3`}>
                  Tags de Posts
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center space-x-1">
                    <span>📺</span>
                    <span>Anime</span>
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center space-x-1">
                    <span>📖</span>
                    <span>Manga</span>
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center space-x-1">
                    <span>🎨</span>
                    <span>Fanart</span>
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center space-x-1">
                    <span>💬</span>
                    <span>Discussão</span>
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center space-x-1">
                    <span>📰</span>
                    <span>Notícias</span>
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center space-x-1">
                    <span>🎬</span>
                    <span>Mídia</span>
                  </span>
                </div>
              </div>

              {/* Moderadores */}
              <div
                className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-4`}
              >
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3`}>
                  Moderadores
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img alt="Admin" className="w-full h-full object-cover" src="/images/anime-girl-4.jpg" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Admin</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img alt="WhiteWolf" className="w-full h-full object-cover" src="/images/anime-girl-5.jpg" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        WhiteWolf
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Main Content */}
          <div className="ml-[380px] mr-[280px] flex-1">
            {/* Navigation Tabs */}
            <div className="top-[88px] left-[456px] right-[280px] z-20 h-[63.5px] flex items-center pl-6">
              <div className="flex items-center space-x-4">
                <div className={`${isDarkMode ? "bg-[#27272a]" : "bg-gray-100"} p-1 rounded-lg inline-flex space-x-1`}>
                  <button
                    onClick={() => setActiveTab("visao-geral")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "visao-geral"
                        ? "bg-white text-gray-900 shadow-sm"
                        : isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    Visão Geral
                  </button>

                  <button
                    onClick={() => setActiveTab("feed")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "feed"
                        ? "bg-white text-gray-900 shadow-sm"
                        : isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    Feed
                  </button>

                  <button
                    onClick={() => setActiveTab("destaque")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "destaque"
                        ? "bg-white text-gray-900 shadow-sm"
                        : isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    Destaque
                  </button>

                  <button
                    onClick={() => setActiveTab("salas")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "salas"
                        ? "bg-white text-gray-900 shadow-sm"
                        : isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    Salas
                  </button>
                </div>
              </div>
            </div>

            <div className="flex mr-6">
              <div className={`mr-6 -mt-[67px]`}></div>
              <div className="flex-1">{renderContent()}</div>
            </div>
          </div>

          {/* Right Column - Members Only */}
          <div className="fixed right-0 top-[88px] h-[calc(100vh-88px)] z-20 w-[280px]">
            <div
              className={`w-full border-l ${isDarkMode ? "border-[#27272a] bg-[#09090b]" : "border-gray-200 bg-white"} h-full overflow-y-auto`}
            >
              {/* Header */}
              <div className="flex w-full">
                <div
                  className={`flex-1 h-[63.5px] flex items-center justify-center space-x-2 ${isDarkMode ? "bg-[#09090b] text-white border-b-2 border-purple-500" : "bg-white text-gray-900 border-b-2 border-purple-600"}`}
                >
                  <i className="bi bi-people"></i>
                  <span className="font-medium">Membros</span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center`}
                      >
                        <span>Membros Online</span>
                        <button onClick={() => setMembersVisible(!membersVisible)} className="ml-2 focus:outline-none">
                          {membersVisible ? (
                            <i className="bi bi-chevron-down text-gray-500"></i>
                          ) : (
                            <i className="bi bi-chevron-right text-gray-500"></i>
                          )}
                        </button>
                      </h4>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {members.length}
                      </span>
                    </div>

                    {membersVisible && (
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className={`flex items-start space-x-3 p-2 rounded-lg ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"} cursor-pointer`}
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img
                                  src={member.avatar || "/placeholder.svg?height=40&width=40"}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h5 className={`font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {member.name}
                                </h5>
                                {member.verified && (
                                  <svg
                                    className="w-4 h-4 text-blue-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>

                              {member.activity && (
                                <div className="">
                                  <div className="flex items-center space-x-1 text-xs">
                                    <span
                                      className={`${member.activity.type === "assistindo" ? "text-red-500" : member.activity.type === "lendo" ? "text-blue-500" : member.activity.type === "jogando" ? "text-green-500" : "text-purple-500"}`}
                                    >
                                      {member.activity.type === "assistindo" && "📺"}
                                      {member.activity.type === "lendo" && "📖"}
                                      {member.activity.type === "jogando" && "🎮"}
                                      {member.activity.type === "ouvindo" && "🎵"}
                                    </span>
                                    <span
                                      className={`${member.activity.type === "assistindo" ? "text-red-500" : member.activity.type === "lendo" ? "text-blue-500" : member.activity.type === "jogando" ? "text-green-500" : "text-purple-500"} capitalize font-medium`}
                                    >
                                      {member.activity.type}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-700"} font-medium truncate`}
                                  >
                                    {member.activity.content}
                                  </p>
                                  {member.activity.details && (
                                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} truncate`}>
                                      {member.activity.details}
                                    </p>
                                  )}
                                  {member.activity.time && (
                                    <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} truncate`}>
                                      {member.activity.time}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
