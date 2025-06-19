"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
// Remover esta linha:
// import { Smile, Search, X, Clock, TrendingUp } from 'lucide-react'

interface ChatMessage {
  id: number
  user: string
  avatar: string
  message: string
  time: string
  isOwn?: boolean
}

interface ChatContentProps {
  chatId: number
  chatName: string
  isDarkMode: boolean
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

interface Sticker {
  id: string
  name: string
  url: string
  alt: string
  category: string
  usage: number
  lastUsed?: Date
}

// Lista de stickers
const allStickers: Sticker[] = [
  // Dance stickers
  {
    id: "pepochristmas",
    name: "PepoChristmas",
    url: "/stickers/3059-pepochristmasdance.gif",
    alt: "Pepo Christmas Dance",
    category: "dance",
    usage: 0,
  },
  {
    id: "bananaparty",
    name: "BananaParty",
    url: "/stickers/2817-bananaparty.gif",
    alt: "Banana Party Dance",
    category: "dance",
    usage: 0,
  },
  {
    id: "partycloudcool",
    name: "PartyCloudCool",
    url: "/stickers/2574-partycloudcoolrainbow.gif",
    alt: "Party Cloud Cool Rainbow",
    category: "dance",
    usage: 0,
  },
  {
    id: "pepodancing",
    name: "PepoDancing",
    url: "/stickers/2561-pepo-dancing.gif",
    alt: "Pepo Dancing",
    category: "dance",
    usage: 0,
  },
  {
    id: "fuhuahoskitty",
    name: "FuhuaHosKitty",
    url: "/stickers/1599-fuhuahoskittydancegif.gif",
    alt: "Fuhua Hos Kitty Dance",
    category: "dance",
    usage: 0,
  },
  {
    id: "rainbowcatparty",
    name: "RainbowCatParty",
    url: "/stickers/99516-rainbow-cat-party.gif",
    alt: "Rainbow Cat Party",
    category: "dance",
    usage: 0,
  },
  {
    id: "dracthyrdance",
    name: "DracthyrDance",
    url: "/stickers/5907-dracthyrdance.gif",
    alt: "Dracthyr Dance",
    category: "dance",
    usage: 0,
  },
  {
    id: "animedance",
    name: "AnimeDance",
    url: "/stickers/97903-anime-dance.gif",
    alt: "Anime Dance",
    category: "dance",
    usage: 0,
  },
  {
    id: "pepodance",
    name: "PepoDance",
    url: "/stickers/6312-pepo-dance.gif",
    alt: "Pepo Dance",
    category: "dance",
    usage: 0,
  },
  {
    id: "ankhapls",
    name: "AnkhaPls",
    url: "/stickers/3938-ankha-pls.gif",
    alt: "Ankha Pls",
    category: "dance",
    usage: 0,
  },
  // Pepe stickers
  {
    id: "sadgepray",
    name: "SadgePray",
    url: "/stickers/4912-sadge-pray.png",
    alt: "Sadge Pray",
    category: "pepe",
    usage: 0,
  },
  {
    id: "peepolove",
    name: "PeepoLove",
    url: "/stickers/4936-peepolove.png",
    alt: "Peepo Love",
    category: "pepe",
    usage: 0,
  },
  {
    id: "pepediamondsword",
    name: "PepeDiamondSword",
    url: "/stickers/4983-pepe-diamond-sword.png",
    alt: "Pepe Diamond Sword",
    category: "pepe",
    usage: 0,
  },
  {
    id: "ezpepe",
    name: "EzPepe",
    url: "/stickers/5492_EzPepe.png",
    alt: "Ez Pepe",
    category: "pepe",
    usage: 0,
  },
  {
    id: "pepewhy",
    name: "PepeWhy",
    url: "/stickers/4114-pepe-why.png",
    alt: "Pepe Why",
    category: "pepe",
    usage: 0,
  },
  {
    id: "pepewideawake",
    name: "PepeWideAwake",
    url: "/stickers/7864-pepewideawake.png",
    alt: "Pepe Wide Awake",
    category: "pepe",
    usage: 0,
  },
  {
    id: "sadge",
    name: "Sadge",
    url: "/stickers/6757_Sadge.png",
    alt: "Sadge",
    category: "pepe",
    usage: 0,
  },
  {
    id: "monkas",
    name: "MonkaS",
    url: "/stickers/monkaS.png",
    alt: "MonkaS",
    category: "pepe",
    usage: 0,
  },
  {
    id: "pepehands",
    name: "PepeHands",
    url: "/stickers/PepeHands.png",
    alt: "Pepe Hands",
    category: "pepe",
    usage: 0,
  },
  {
    id: "pepeyes",
    name: "PepeYes",
    url: "/stickers/7572-pepe-yes.png",
    alt: "Pepe Yes",
    category: "pepe",
    usage: 0,
  },
]

// Conteúdo específico para cada chat baseado no ID
const getChatMessages = (chatId: number, additionalMessages: ChatMessage[] = []): ChatMessage[] => {
  const chatContents: { [key: number]: ChatMessage[] } = {
    1: [
      {
        id: 1,
        user: "KawaiiDream",
        avatar: "/images/anime-profiles/blonde-cat-girl.jpg",
        message: "Pessoal, alguém assistiu o novo episódio de Demon Slayer?",
        time: "14:30",
      },
      {
        id: 2,
        user: "BlueEyedHero",
        avatar: "/images/anime-profiles/green-hair-girl.jpg",
        message: "Sim! Foi incrível! A animação estava perfeita 🔥",
        time: "14:32",
      },
      {
        id: 3,
        user: "GreenGoddess",
        avatar: "/images/anime-profiles/adventure-boy.jpg",
        message: "A luta do Tanjiro foi épica! Chorei na parte final 😭",
        time: "14:33",
      },
    ],
    2: [
      {
        id: 1,
        user: "MagicalStar",
        avatar: "/images/anime-profiles/pink-hair-cats.jpg",
        message: "Gente, o último capítulo de Chainsaw Man foi insano!",
        time: "15:20",
      },
      {
        id: 2,
        user: "DarkInk",
        avatar: "/images/anime-profiles/neon-girl.jpg",
        message: "Fujimoto nunca decepciona! Cada capítulo é uma montanha-russa emocional",
        time: "15:22",
      },
    ],
  }

  return [...(chatContents[chatId] || []), ...additionalMessages]
}

export default function ChatContent({
  chatId,
  chatName,
  isDarkMode,
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyDown,
  onTextareaChange,
}: ChatContentProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [additionalMessages, setAdditionalMessages] = useState<ChatMessage[]>([])
  const [showStickers, setShowStickers] = useState(false)
  const [activeCategory, setActiveCategory] = useState<"recentes" | "mais-usadas" | "dance" | "pepe">("recentes")
  const [searchTerm, setSearchTerm] = useState("")
  const [stickerStats, setStickerStats] = useState<{ [key: string]: { usage: number; lastUsed: Date } }>({})

  const messages = getChatMessages(chatId, additionalMessages)

  // Clear additional messages when chatId changes
  useEffect(() => {
    setAdditionalMessages([])
  }, [chatId])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Função para renderizar mensagem com stickers
  const renderMessageContent = (message: string) => {
    const stickerRegex = new RegExp(`\\b(${allStickers.map((s) => s.name).join("|")})\\b`, "g")
    const parts = message.split(stickerRegex)

    return parts.map((part, index) => {
      const sticker = allStickers.find((s) => s.name === part)
      if (sticker) {
        return (
          <img
            key={index}
            src={sticker.url || "/placeholder.svg"}
            alt={sticker.alt}
            className="inline-block w-8 h-8 mx-1 align-middle"
          />
        )
      }
      return part
    })
  }

  // Handle sending message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date()
      const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      const newMsg: ChatMessage = {
        id: Date.now(),
        user: "Você",
        avatar: "/images/new-profile.jpg",
        message: newMessage.trim(),
        time: timeString,
        isOwn: true,
      }

      setAdditionalMessages((prev) => [...prev, newMsg])
      onSendMessage()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Função para adicionar sticker à mensagem e atualizar estatísticas
  const addStickerToMessage = (sticker: Sticker) => {
    const currentMessage = newMessage
    const newMessageWithSticker = currentMessage ? `${currentMessage} ${sticker.name}` : sticker.name
    setNewMessage(newMessageWithSticker)
    setShowStickers(false)

    // Atualizar estatísticas do sticker
    setStickerStats((prev) => ({
      ...prev,
      [sticker.id]: {
        usage: (prev[sticker.id]?.usage || 0) + 1,
        lastUsed: new Date(),
      },
    }))
  }

  // Filtrar stickers baseado na busca
  const filteredStickers = allStickers.filter(
    (sticker) =>
      sticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sticker.alt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Obter stickers por categoria
  const getStickersByCategory = () => {
    switch (activeCategory) {
      case "recentes":
        return allStickers
          .filter((sticker) => stickerStats[sticker.id]?.lastUsed)
          .sort((a, b) => {
            const aLastUsed = stickerStats[a.id]?.lastUsed || new Date(0)
            const bLastUsed = stickerStats[b.id]?.lastUsed || new Date(0)
            return bLastUsed.getTime() - aLastUsed.getTime()
          })
          .slice(0, 20)
      case "mais-usadas":
        return allStickers
          .filter((sticker) => stickerStats[sticker.id]?.usage > 0)
          .sort((a, b) => {
            const aUsage = stickerStats[a.id]?.usage || 0
            const bUsage = stickerStats[b.id]?.usage || 0
            return bUsage - aUsage
          })
          .slice(0, 20)
      case "dance":
        return allStickers.filter((sticker) => sticker.category === "dance")
      case "pepe":
        return allStickers.filter((sticker) => sticker.category === "pepe")
      default:
        return allStickers
    }
  }

  const stickersToShow = searchTerm ? filteredStickers : getStickersByCategory()

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className={`${isDarkMode ? "bg-[#09090b]" : "bg-white"} flex flex-col h-full overflow-hidden`}>
        {/* Área de Mensagens ou Seletor de Stickers */}
        {showStickers ? (
          // Seletor de Stickers em Tela Cheia
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header do Seletor */}
            <div className={`${isDarkMode ? "border-[#27272a]" : "border-gray-200"} border-b p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Escolha uma Figurinha
                </h2>
                <button
                  onClick={() => setShowStickers(false)}
                  className={`p-2 ${isDarkMode ? "hover:bg-[#27272a] text-gray-400" : "hover:bg-gray-100 text-gray-600"} rounded-full transition-colors`}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Barra de Busca */}
              <div className="relative mb-4">
                <i className="bi-compass position-absolute start-0 top-50 translate-middle-y text-gray-400 ms-3"></i>
                <input
                  type="text"
                  placeholder="Buscar figurinhas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${isDarkMode ? "bg-[#27272a] border-[#3f3f46] text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              {/* Categorias */}
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setActiveCategory("recentes")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === "recentes"
                      ? isDarkMode
                        ? "bg-purple-600 text-white"
                        : "bg-purple-600 text-white"
                      : isDarkMode
                        ? "bg-[#27272a] text-gray-300 hover:bg-[#3f3f46]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="bi bi-clock me-2"></i>
                  <span>Recentes</span>
                </button>
                <button
                  onClick={() => setActiveCategory("mais-usadas")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === "mais-usadas"
                      ? isDarkMode
                        ? "bg-purple-600 text-white"
                        : "bg-purple-600 text-white"
                      : isDarkMode
                        ? "bg-[#27272a] text-gray-300 hover:bg-[#3f3f46]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="bi bi-trending-up me-2"></i>
                  <span>Mais Usadas</span>
                </button>
                <button
                  onClick={() => setActiveCategory("dance")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === "dance"
                      ? isDarkMode
                        ? "bg-purple-600 text-white"
                        : "bg-purple-600 text-white"
                      : isDarkMode
                        ? "bg-[#27272a] text-gray-300 hover:bg-[#3f3f46]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  💃 Dance
                </button>
                <button
                  onClick={() => setActiveCategory("pepe")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === "pepe"
                      ? isDarkMode
                        ? "bg-purple-600 text-white"
                        : "bg-purple-600 text-white"
                      : isDarkMode
                        ? "bg-[#27272a] text-gray-300 hover:bg-[#3f3f46]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🐸 Pepe
                </button>
              </div>
            </div>

            {/* Grid de Stickers */}
            <div className="flex-1 overflow-y-auto p-4">
              {stickersToShow.length > 0 ? (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {stickersToShow.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => addStickerToMessage(sticker)}
                      className={`relative p-3 rounded-lg ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} transition-colors group`}
                      title={sticker.name}
                    >
                      <img
                        src={sticker.url || "/placeholder.svg"}
                        alt={sticker.alt}
                        className="w-12 h-12 mx-auto group-hover:scale-110 transition-transform"
                      />
                      {stickerStats[sticker.id]?.usage > 0 && (
                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {stickerStats[sticker.id].usage}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <i className={`bi-compass display-1 ${isDarkMode ? "text-gray-600" : "text-gray-400"} mb-4`}></i>
                  <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {searchTerm ? "Nenhuma figurinha encontrada" : "Nenhuma figurinha nesta categoria"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Área de Mensagens Normal
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={messagesContainerRef}
              className={`chat-messages-container flex-1 overflow-y-auto overflow-x-hidden space-y-4 ${isDarkMode ? "bg-[#09090b]" : "bg-[#f8f9fa]"} w-full`}
              style={{
                height: "100%",
                minHeight: "0",
                overflowWrap: "break-word",
                wordBreak: "break-all",
                hyphens: "auto",
                padding: "16px",
              }}
            >
              {messages.map((message) => (
                <div key={message.id} className="flex justify-start w-full overflow-hidden">
                  <div className="flex items-start space-x-3 w-full max-w-full overflow-hidden">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={message.avatar || "/placeholder.svg"}
                          alt={message.user}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {message.user}
                        </span>
                        <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                          {message.time}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                        style={{
                          wordBreak: "break-all",
                          overflowWrap: "anywhere",
                          hyphens: "auto",
                          maxWidth: "100%",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {renderMessageContent(message.message)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campo de Input */}
        <div className={`${isDarkMode ? "border-[#27272a]" : "border-gray-200"} border-t p-4 flex-shrink-0`}>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStickers(!showStickers)}
              className={`p-3 ${isDarkMode ? "hover:bg-[#27272a] text-gray-400 hover:text-gray-300" : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"} rounded-full transition-colors flex-shrink-0 ${showStickers ? (isDarkMode ? "bg-[#27272a] text-purple-400" : "bg-gray-100 text-purple-600") : ""}`}
              title="Figurinhas"
            >
              <i className="bi bi-emoji-smile"></i>
            </button>

            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={onTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                rows={1}
                className={`w-full px-4 py-3 border resize-none ${
                  isDarkMode
                    ? "bg-[#27272a] border-[#3f3f46] text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                style={{
                  minHeight: "48px",
                  maxHeight: "120px",
                  lineHeight: "24px",
                  overflowY: "hidden",
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white p-3 rounded-full transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
