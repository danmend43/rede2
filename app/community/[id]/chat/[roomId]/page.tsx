"use client"

import { useState, useEffect } from "react"
import { Search, Home, Settings, Plus, Users, MessageSquare, X, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

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

const communities: Community[] = [
  {
    id: 1,
    name: "Anime Café",
    avatar: "/images/anime-cafe-avatar.jpg",
    coverImage: "/images/anime-cafe-avatar.jpg",
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
    name: "Gawr gura  Club",
    avatar: "/images/anime-girl-2.jpg",
    coverImage: "/images/anime-girl-2.jpg",
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
    avatar: "/images/anime-girl-4.jpg",
    coverImage: "/images/anime-girl-4.jpg",
    members: 12500,
    online: 189,
    description: "Comunidade brasileira de Demon Slayer. Técnicas de respiração, caça aos demônios e muito mais!",
    createdAt: "31 de jul. de 2020",
    isPublic: true,
    category: "Anime e Mangá",
    activeMembers: 234,
  },
]

const roomNames: { [key: number]: string } = {
  1: "Chat Geral",
  2: "Discussão de Animes",
  3: "Mangás e Light Novels",
  4: "Fanarts e Criações",
  5: "Eventos e Anúncios",
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const communityId = Number(params.id)
  const roomId = Number(params.roomId)

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCommunitiesMenuOpen, setIsCommunitiesMenuOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null)

  // Load preferences and community data
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }

    // Find community by ID
    const community = communities.find((c) => c.id === communityId)
    if (community) {
      setCurrentCommunity(community)
    }
  }, [communityId])

  const closeAllMenus = () => {
    setIsCommunitiesMenuOpen(false)
    setIsSettingsMenuOpen(false)
  }

  const switchCommunity = (community: Community) => {
    setIsCommunitiesMenuOpen(false)
    router.push(`/community/${community.id}`)
  }

  const roomName = roomNames[roomId] || "Sala Desconhecida"

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#0C0C0C] text-white" : "bg-gray-50 text-gray-900"} flex font-sans`}
    >
      {/* Left Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-[76px] ${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} border-r flex flex-col items-center py-4 z-50`}
      >
        {/* coronoIcon */}
        <div className="mb-8">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center">
              <img
                src={isDarkMode ? "/images/logobilibili-white.png" : "/images/bilibili-icon.png"}
                alt="Bilibili"
                className="w-8 h-8"
              />
            </button>
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col space-y-8 flex-1">
          <Link href="/home">
            <button className="w-10 h-10 flex items-center justify-center">
              <Home className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`} strokeWidth={1.5} />
            </button>
          </Link>

          <button className="w-10 h-10 flex items-center justify-center">
            <Search className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`} strokeWidth={1.5} />
          </button>

          <button
            className="w-10 h-10 flex items-center justify-center relative"
            onClick={() => {
              closeAllMenus()
              setIsCommunitiesMenuOpen(!isCommunitiesMenuOpen)
            }}
          >
            <Users className={`w-6 h-6 text-purple-500`} strokeWidth={1.5} />
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-purple-600 rounded-l-full"></div>
          </button>

          <button className="w-10 h-10 flex items-center justify-center">
            <Plus className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`} strokeWidth={1.5} />
          </button>

          <button className="w-10 h-10 flex items-center justify-center">
            <MessageSquare className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`} strokeWidth={1.5} />
          </button>
        </div>

        {/* Settings at bottom */}
        <div className="mt-auto mb-6 flex flex-col items-center space-y-6">
          <button
            className="w-10 h-10 flex items-center justify-center relative"
            onClick={() => {
              closeAllMenus()
              setIsSettingsMenuOpen(!isSettingsMenuOpen)
            }}
          >
            <Settings className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`} strokeWidth={1.5} />
            {isSettingsMenuOpen && (
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-purple-600 rounded-l-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Menu de Comunidades */}
      {isCommunitiesMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsCommunitiesMenuOpen(false)}></div>
          <div
            className={`fixed left-[76px] top-0 h-full w-80 ${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} border-r z-50 shadow-lg overflow-y-auto`}
          >
            <div className={`p-4 border-b ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}>
              <h2 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Suas Comunidades
              </h2>
              <button
                onClick={() => setIsCommunitiesMenuOpen(false)}
                className={`p-1 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"} rounded-full absolute top-4 right-4`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar comunidades..."
                  className={`w-full pl-10 pr-4 py-2 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm`}
                />
              </div>

              <div className="space-y-3">
                {communities.map((community) => (
                  <div
                    key={community.id}
                    onClick={() => switchCommunity(community)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentCommunity?.id === community.id
                        ? isDarkMode
                          ? "bg-[#27272a] border-[#3f3f46]"
                          : "bg-purple-50 border border-purple-200"
                        : isDarkMode
                          ? "border border-[#27272a] hover:bg-[#27272a]"
                          : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={community.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={community.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} truncate text-sm`}>
                        {community.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{community.members.toLocaleString()} membros</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{community.online} online</span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Explorar Mais Comunidades
              </button>
            </div>
          </div>
        </>
      )}

      {/* Menu de Configurações */}
      {isSettingsMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
          <div
            className={`fixed left-[76px] top-0 h-full w-80 ${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} border-r z-50 shadow-lg overflow-y-auto`}
          >
            <div className={`p-4 border-b ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} relative`}>
              <h2 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Menu
              </h2>
              <button
                onClick={() => setIsSettingsMenuOpen(false)}
                className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"} rounded-full absolute top-2 right-2 transition-colors`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
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
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    Adicionar conta da comunidade
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    Trocar de conta
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                  >
                    Sair
                  </button>
                  <Link href="/settings">
                    <button
                      className={`w-full text-left px-3 py-2.5 rounded-lg ${isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"} transition-colors text-sm`}
                    >
                      Configurações
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {(isCommunitiesMenuOpen || isSettingsMenuOpen) && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={closeAllMenus}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-[76px]">
        {/* Search Bar */}
        <div
          className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} p-4 border-b fixed top-0 left-[76px] right-0 z-30`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/community/${communityId}`}>
                <button
                  className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-full transition-colors`}
                >
                  <svg
                    className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </Link>
              <div>
                <h1 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{roomName}</h1>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{currentCommunity?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="/images/dan-profile.jpg" alt="Perfil" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="mt-[72px] h-[calc(100vh-72px)] flex items-center justify-center">
          <div className="text-center">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full ${isDarkMode ? "bg-[#27272a]" : "bg-gray-100"} flex items-center justify-center`}
            >
              <MessageSquare className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
            </div>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
              vou criar ainda :3
            </p>
            <Link href={`/community/${communityId}`}>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Voltar para a Comunidade
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
