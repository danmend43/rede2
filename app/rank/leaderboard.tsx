"use client"

import { ArrowLeft, Crown, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px 2px rgba(255, 215, 0, 0.6); }
    50% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.9); }
  }

  @keyframes skeleton {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: skeleton 1.5s infinite;
  }

  .crown-no-line path:last-child {
    display: none;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
  }

  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(45deg); }
    50% { transform: translateY(-20px) rotate(225deg); }
  }

  @keyframes float3 {
    0%, 100% { transform: translateY(0px) rotate(90deg); }
    50% { transform: translateY(-40px) rotate(270deg); }
  }

  .floating-cube {
    animation: float 8s ease-in-out infinite;
  }

  .floating-cube:nth-child(2n) {
    animation: float2 6s ease-in-out infinite;
    animation-delay: -2s;
  }

  .floating-cube:nth-child(3n) {
    animation: float3 10s ease-in-out infinite;
    animation-delay: -4s;
  }
  
  .leaderboard-item {
    transition: all 0.3s ease;
  }
  
  .leaderboard-item:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
`

interface Cube {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  color: string
  baseX: number
  baseY: number
}

const basePoints = 10000 // Declare basePoints variable
const baseLevel = 50 // Declare baseLevel variable

export default function Component() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState("brasil")
  const [activeTab, setActiveTab] = useState("global")
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyShowing, setCurrentlyShowing] = useState(10)
  const [isRegionExpanded, setIsRegionExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cubes, setCubes] = useState<Cube[]>([])
  const [isRankingMenuOpen, setIsRankingMenuOpen] = useState(false)
  const [regionRankingType, setRegionRankingType] = useState("pontos")
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  const [isTabLoading, setIsTabLoading] = useState(false)
  const [showSupporters, setShowSupporters] = useState(false)
  const [supporterFilter, setSupporterFilter] = useState("mais-novo") // "mais-novo" ou "mais-antigo"

  const [supportersList] = useState(() => {
    const supporters = []
    const names = [
      "DragonSlayer",
      "MysticWizard",
      "ShadowNinja",
      "StarGazer",
      "ThunderBolt",
      "C++",
      "FirePhoenix",
      "DarkKnight",
      "LightMage",
      "StormRider",
      "CrystalHunter",
      "VoidWalker",
      "SkyDancer",
      "EarthShaker",
      "WaveRider",
      "FlameGuard",
      "FrostBite",
      "WindRunner",
      "StoneCrusher",
      "LightBringer",
      "DarkLord",
      "SpiritWolf",
      "GoldenEagle",
      "SilverFox",
      "IronBear",
      "CopperSnake",
      "DiamondTiger",
      "RubyDragon",
      "EmeraldLion",
      "SapphireHawk",
    ]

    const flags = [
      "/flags/brazil.png",
      "/flags/argentina.png",
      "/flags/portugal.png",
      "/flags/united-states.png",
      "/flags/france.png",
      "/flags/south-korea.png",
    ]

    for (let i = 0; i < 30; i++) {
      const randomDate = new Date(2020 + (i % 5), (i * 3) % 12, ((i * 7) % 28) + 1)
      supporters.push({
        id: i + 1,
        name: names[i % names.length],
        avatar: `/avatars/avatar${(i % 8) + 1}.jpeg`,
        flag: flags[i % flags.length],
        supportDate: randomDate,
        formattedDate: `${randomDate.getDate().toString().padStart(2, "0")}/${(randomDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${randomDate.getFullYear()}`,
      })
    }
    return supporters
  })

  // Inicializar cubos
  useEffect(() => {
    const generateCubes = () => {
      const newCubes: Cube[] = []
      const colors = [
        "rgba(255, 255, 255, 0.4)",
        "rgba(255, 215, 0, 0.3)",
        "rgba(255, 165, 0, 0.3)",
        "rgba(255, 255, 255, 0.2)",
        "rgba(255, 215, 0, 0.4)",
        "rgba(255, 140, 0, 0.3)",
        "rgba(255, 255, 255, 0.3)",
      ]

      for (let i = 0; i < 20; i++) {
        const cube: Cube = {
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 80 + 30, // 30px a 110px
          opacity: Math.random() * 0.6 + 0.2, // 0.2 a 0.8
          color: colors[Math.floor(Math.random() * colors.length)],
          baseX: Math.random() * window.innerWidth,
          baseY: Math.random() * window.innerHeight,
        }
        newCubes.push(cube)
      }
      setCubes(newCubes)
    }

    generateCubes()
    window.addEventListener("resize", generateCubes)
    return () => window.removeEventListener("resize", generateCubes)
  }, [])

  // Rastrear movimento do mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }

      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Schedule cube position update
      animationFrameRef.current = requestAnimationFrame(() => {
        setCubes((prevCubes) =>
          prevCubes.map((cube) => {
            const distanceX = (mousePositionRef.current.x - cube.baseX) * 0.05
            const distanceY = (mousePositionRef.current.y - cube.baseY) * 0.05

            return {
              ...cube,
              x: cube.baseX + distanceX,
              y: cube.baseY + distanceY,
            }
          }),
        )
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const getCountriesWithFlags = () => {
    return [
      { value: "brasil", label: "Brasil", flag: "/flags/brazil.png" },
      { value: "argentina", label: "Argentina", flag: "/flags/argentina.png" },
      { value: "portugal", label: "Portugal", flag: "/flags/portugal.png" },
      { value: "estados-unidos", label: "Estados Unidos", flag: "/flags/united-states.png" },
      { value: "franca", label: "França", flag: "/flags/france.png" },
      { value: "coreia-do-sul", label: "Coreia do Sul", flag: "/flags/south-korea.png" },
    ]
  }

  const getBadge = (position: number) => {
    const badges = ["/badges/verified-yellow.png", "/badges/verified-green.png", "/badges/verified-blue.png"]

    // Usar posição para determinar badge de forma consistente
    return badges[position % badges.length]
  }

  // Função para obter bandeira do país baseado na posição
  const getCountryFlag = (position: number) => {
    const flags = [
      "/flags/brazil.png",
      "/flags/argentina.png",
      "/flags/portugal.png",
      "/flags/united-states.png",
      "/flags/france.png",
      "/flags/south-korea.png",
    ]
    return flags[position % flags.length]
  }

  const colorGroups = [
    { color: "from-blue-300 to-blue-400", bgColor: "bg-blue-500" }, // 5-10
    { color: "from-green-300 to-green-400", bgColor: "bg-green-500" }, // 11-20
    { color: "from-red-300 to-red-400", bgColor: "bg-red-500" }, // 21-30
    { color: "from-pink-300 to-pink-400", bgColor: "bg-pink-500" }, // 31-40
    { color: "from-indigo-300 to-indigo-400", bgColor: "bg-indigo-500" }, // 41-50
    { color: "from-teal-300 to-teal-400", bgColor: "bg-teal-500" }, // 51-60
    { color: "from-orange-300 to-orange-400", bgColor: "bg-orange-500" }, // 61-70
    { color: "from-cyan-300 to-cyan-400", bgColor: "bg-cyan-500" }, // 71-80
    { color: "from-lime-300 to-lime-400", bgColor: "bg-lime-500" }, // 81-90
    { color: "from-violet-300 to-violet-400", bgColor: "bg-violet-500" }, // 91-100
  ]

  const defaultColor = { color: "from-gray-300 to-gray-400", bgColor: "bg-gray-500" }

  const generatePlayer = (position: number) => {
    const names = [
      "DragonSlayer",
      "MysticWizard",
      "ShadowNinja",
      "StarGazer",
      "ThunderBolt",
      "c++",
      "FirePhoenix",
      "DarkKnight",
      "LightMage",
      "StormRider",
      "CrystalHunter",
      "VoidWalker",
      "SkyDancer",
      "EarthShaker",
      "WaveRider",
      "FlameGuard",
      "FrostBite",
      "WindRunner",
      "StoneCrusher",
      "LightBringer",
      "DarkLord",
      "SpiritWolf",
      "GoldenEagle",
      "SilverFox",
      "IronBear",
      "CopperSnake",
      "DiamondTiger",
      "RubyDragon",
      "EmeraldLion",
      "SapphireHawk",
      "BloodRaven",
      "MoonWolf",
      "SunPhoenix",
      "StarKnight",
      "VoidMage",
      "CrystalBeast",
      "ShadowLord",
      "LightWarden",
      "DarkAngel",
      "FireDemon",
      "IceWizard",
      "StormKing",
      "EarthGuard",
      "WaveKnight",
      "FlameRider",
      "FrostLord",
      "WindMage",
      "StoneWolf",
      "LightPhoenix",
      "DarkBeast",
    ]

    // Sistema de cores por grupos de 10 (exceto 5-10 que é um grupo especial)

    // Cor padrão para posições 101+

    // Determinar a cor baseada na posição
    let playerColor = defaultColor

    if (position >= 5 && position <= 100) {
      let groupIndex
      if (position <= 10) {
        groupIndex = 0 // Posições 5-10 usam o primeiro grupo
      } else {
        groupIndex = Math.floor((position - 1) / 10) // Grupos de 10 em 10
      }

      if (groupIndex < colorGroups.length) {
        playerColor = colorGroups[groupIndex]
      }
    }

    return {
      name: names[(position - 5) % names.length] || `Player${position}`,
      points: basePoints.toLocaleString(),
      level: Math.max(baseLevel, 10).toString(),
      badge: getBadge(position),
      flag: getCountryFlag(position),
      ...playerColor,
    }
  }

  const handleRegionClick = () => {
    setActiveTab("regiao")
    setIsRegionExpanded(true)
    setIsRankingMenuOpen(false)
  }

  const handleBackClick = () => {
    setIsRegionExpanded(false)
    setActiveTab("global")
  }

  const handleRankingMenuClick = () => {
    setIsRankingMenuOpen(!isRankingMenuOpen)
  }

  const handleMenuItemClick = async (tab: string) => {
    setIsTabLoading(true)
    setActiveTab(tab)
    setIsRankingMenuOpen(false)
    setShowSupporters(false) // IMPORTANTE: Sair da tela de apoiadores

    // Simular carregamento por 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (tab === "regiao") {
      setIsRegionExpanded(true)
    } else {
      setIsRegionExpanded(false)
    }

    setIsTabLoading(false)
  }

  const loadMoreItems = async () => {
    if (currentlyShowing >= 1000) return

    setIsLoading(true)

    // Mostrar skeleton por 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Carregar mais 10 itens
    const newCount = Math.min(currentlyShowing + 10, 1000)
    setCurrentlyShowing(newCount)
    setIsLoading(false)
  }

  const renderSkeletonEntry = (index: number) => (
    <div key={`skeleton-${index}`} className="bg-white/40 rounded-full px-6 py-4 flex items-center gap-4">
      <div className="w-8 h-8 bg-gray-300 rounded-lg skeleton"></div>
      <div className="w-12 h-12 rounded-full bg-gray-300 skeleton"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded skeleton mb-2 w-32"></div>
        <div className="h-4 bg-gray-300 rounded skeleton w-24"></div>
      </div>
      <div className="text-right flex items-center gap-2">
        <div className="h-6 bg-gray-300 rounded skeleton w-8"></div>
        <div className="h-5 bg-gray-300 rounded skeleton w-16"></div>
      </div>
    </div>
  )

  const getActiveTabLabel = () => {
    switch (activeTab) {
      case "global":
        return "Pontos"
      case "amigos":
        return "Amigos"
      case "regiao":
        return "Região"
      case "presentes":
        return "Presentes"
      case "conquistas":
        return "Conquistas"
      case "lives":
        return "Lives"
      case "comunidades":
        return "Comunidades"
      default:
        return "Pontos"
    }
  }

  const getRankingTitle = () => {
    switch (activeTab) {
      case "global":
        return "Ranking Pontos"
      case "amigos":
        return "Ranking Amigos"
      case "regiao":
        return "Ranking Região"
      case "presentes":
        return "Ranking Presentes"
      case "conquistas":
        return "Ranking Conquistas"
      case "lives":
        return "Ranking Lives"
      case "comunidades":
        return "Ranking Comunidades"
      default:
        return "Ranking Pontos"
    }
  }

  const handleSupportersClick = () => {
    setShowSupporters(true)
    setIsRankingMenuOpen(false)
  }

  return (
    <>
      <style jsx>{shimmerStyle}</style>
      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 relative overflow-hidden"
      >
        {/* Cubos geométricos animados - MAIS VISÍVEIS */}
        <div className="absolute inset-0 z-0">
          {cubes.map((cube) => (
            <div
              key={cube.id}
              className="floating-cube absolute border-2 border-white/20"
              style={{
                left: `${cube.x}px`,
                top: `${cube.y}px`,
                width: `${cube.size}px`,
                height: `${cube.size}px`,
                backgroundColor: cube.color,
                opacity: cube.opacity,
                transform: "rotate(45deg)",
                transition: "all 0.3s ease-out",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </div>

        {/* Overlay desfocado LEVE para suavizar os cubos */}
        <div className="absolute inset-0 z-1 backdrop-blur-[2px] bg-gradient-to-br from-orange-300/10 via-orange-400/10 to-orange-500/10"></div>

        <div className="relative z-10 p-4">
          {/* Header SIMPLES */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/home")}
              className="bg-black rounded-xl p-3 hover:bg-black/80 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Voltar</h1>
          </div>

          <div className="flex justify-center">
            {/* Left sidebar menu - DESIGN MELHORADO MAS MANTENDO O CONCEITO ORIGINAL */}
            <div className="absolute left-12 top-32 flex flex-col gap-3 w-56">
              <div className="space-y-3 relative">
                {/* Ranking Geral com dropdown - COR LARANJA */}
                <div className="relative">
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm shadow-lg ${
                      !showSupporters
                        ? "bg-black text-white"
                        : "bg-white/10 text-white hover:bg-white/20 hover:text-blue-100"
                    }`}
                    onClick={handleRankingMenuClick}
                  >
                    <Crown className="w-5 h-5" />
                    <span className="font-medium flex-1">{getRankingTitle()}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isRankingMenuOpen ? "rotate-180" : ""}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isRankingMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden z-50">
                      <div className="py-2">
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "global" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("global")}
                        >
                          <span className="text-black">Pontos</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "amigos" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("amigos")}
                        >
                          <span className="text-black">Amigos</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "regiao" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("regiao")}
                        >
                          <span className="text-black">Região</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "presentes" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("presentes")}
                        >
                          <span className="text-black">Presentes</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "conquistas" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("conquistas")}
                        >
                          <span className="text-black">Conquistas</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "lives" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("lives")}
                        >
                          <span className="text-black">Lives</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-orange-400/20 transition-colors ${
                            activeTab === "comunidades" ? "bg-orange-400/30 font-medium" : ""
                          }`}
                          onClick={() => handleMenuItemClick("comunidades")}
                        >
                          <span className="text-black">Comunidades</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ranking de Eventos */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-blue-100"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">Ranking de Eventos</span>
                </div>

                {/* Membros Apoiador */}
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm shadow-lg ${
                    showSupporters
                      ? "bg-black text-white"
                      : "bg-white/10 text-white hover:bg-white/20 hover:text-blue-100"
                  }`}
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                  onClick={handleSupportersClick}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="font-medium">Membros Apoiador</span>
                  <div className="w-2 h-2 bg-blue-200 rounded-full ml-auto animate-pulse"></div>
                </div>

                {/* Beta */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-blue-100"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">Beta</span>
                  <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium ml-auto">NOVO</div>
                </div>

                {/* Ranking Semanal - DESTACADO */}
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl px-4 py-3 cursor-pointer hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 shadow-lg transform hover:scale-105">
                  <div className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="font-medium">Ranking Semanal</span>
                    <div className="w-2 h-2 bg-white rounded-full ml-auto animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content - CENTERED - LARGURA MAIOR */}
            <div className="w-full max-w-6xl mx-auto">
              {showSupporters ? (
                // Tela de Membros Apoiadores
                <>
                  {/* Header dos Apoiadores */}
                  <div className="flex items-center justify-between mb-6 ml-72">
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">Membros Apoiadores</h2>

                    {/* Filtro de Data */}
                    <select
                      value={supporterFilter}
                      onChange={(e) => setSupporterFilter(e.target.value)}
                      className="px-4 py-2 bg-white/90 text-gray-900 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
                    >
                      <option value="mais-novo">Mais Recente</option>
                      <option value="mais-antigo">Mais Antigo</option>
                    </select>
                  </div>

                  {/* Grid de Apoiadores */}
                  <div className="grid grid-cols-4 gap-6 mb-8 ml-72">
                    {[...supportersList]
                      .sort((a, b) => {
                        if (supporterFilter === "mais-novo") {
                          return b.supportDate.getTime() - a.supportDate.getTime()
                        } else {
                          return a.supportDate.getTime() - b.supportDate.getTime()
                        }
                      })
                      .map((supporter) => (
                        <div
                          key={supporter.id}
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-3 border-3 border-yellow-400">
                              <Image
                                src={supporter.avatar || "/placeholder.svg"}
                                alt={supporter.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="text-white font-bold text-sm uppercase mb-2 truncate w-full">
                              {supporter.name}
                            </h3>
                            <div className="bg-blue-200 px-3 py-1 rounded-full flex items-center gap-2">
                              <div className="w-4 h-4 rounded overflow-hidden">
                                <Image
                                  src={supporter.flag || "/placeholder.svg"}
                                  alt="Flag"
                                  width={16}
                                  height={16}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-black font-medium text-sm">{supporter.formattedDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                // Conteúdo original do leaderboard
                <>
                  {/* Tabs - LARGURA FIXA */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 ease-in-out w-[500px] mx-auto">
                      {!isRegionExpanded ? (
                        // Modo normal - campo de pesquisa
                        <div className="flex gap-2 justify-center items-center">
                          <input
                            type="text"
                            placeholder="Procurar usuário..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/90 text-gray-900 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base font-medium placeholder-gray-500"
                          />
                        </div>
                      ) : (
                        // Modo região expandida - apenas país e tipo de ranking
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            className="p-2 rounded-full bg-white/60 hover:bg-white/70 transition-colors"
                            onClick={() => router.push("/home")}
                          >
                            <ArrowLeft className="w-4 h-4 text-black" />
                          </button>

                          <div className="flex gap-2 flex-1">
                            <select
                              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm shadow-lg bg-black text-white"
                              value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                              {getCountriesWithFlags().map((country) => (
                                <option key={country.value} value={country.value}>
                                  {country.label}
                                </option>
                              ))}
                            </select>
                            <select
                              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm shadow-lg bg-black text-white"
                              value={regionRankingType}
                              onChange={(e) => setRegionRankingType(e.target.value)}
                            >
                              <option value="pontos">Pontos</option>
                              <option value="amigos">Amigos</option>
                              <option value="presentes">Presentes</option>
                              <option value="conquistas">Conquistas</option>
                              <option value="lives">Lives</option>
                              <option value="comunidades">Comunidades</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resto do conteúdo do leaderboard permanece igual... */}
                  <div className="space-y-4 mb-6 mx-auto max-w-lg">
                    {isTabLoading ? (
                      // Mostrar skeleton durante troca de tab - INCLUINDO O PRIMEIRO LUGAR
                      <>
                        {/* Skeleton para o primeiro lugar */}
                        <div className="bg-white/40 rounded-full px-6 py-4 mb-6 flex items-center gap-4 mx-auto max-w-lg">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg skeleton"></div>
                          <div className="w-16 h-16 rounded-full bg-gray-300 skeleton"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-300 rounded skeleton mb-2 w-40"></div>
                            <div className="h-4 bg-gray-300 rounded skeleton w-32"></div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div className="h-6 bg-gray-300 rounded skeleton w-8"></div>
                            <div className="h-8 bg-gray-300 rounded-full skeleton w-12"></div>
                          </div>
                        </div>
                        {/* Skeleton para os outros */}
                        {Array.from({ length: 10 }, (_, index) => renderSkeletonEntry(index))}
                      </>
                    ) : (
                      <>
                        {/* PRIMEIRO LUGAR - SUPER DESTACADO - só mostrar quando não está carregando */}
                        <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full px-6 py-4 mb-6 flex items-center gap-4 hover:shadow-lg transition-shadow mx-auto max-w-lg leaderboard-item">
                          <div className="relative">
                            <Crown className="w-5 h-5 fill-yellow-400 stroke-yellow-600 absolute -top-2 -left-1 crown-no-line" />
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">#1</span>
                            </div>
                          </div>
                          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg relative z-10">
                            <Image
                              src="/avatars/avatar5.jpeg"
                              alt="Golang"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-black font-bold text-lg uppercase">GOLANG</div>
                              <Image
                                src={getBadge(1) || "/placeholder.svg"}
                                alt="Badge"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="text-black/80 text-sm">18.945 pontos</div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div className="w-6 h-6 rounded overflow-hidden">
                              <Image
                                src="/flags/brazil.png"
                                alt="Brazil"
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-orange-500 px-3 py-1 rounded-full">
                              <span className="text-white font-bold text-lg">95</span>
                            </div>
                          </div>
                        </div>

                        {/* Entry 2, 3, 4 e resto... */}

                        {/* Entry 2 */}
                        <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-full px-6 py-4 flex items-center gap-4 hover:shadow-lg transition-shadow leaderboard-item">
                          <div className="relative">
                            <Crown className="w-5 h-5 fill-gray-300 stroke-gray-500 absolute -top-2 -left-1 crown-no-line" />
                            <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">#2</span>
                            </div>
                          </div>
                          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg relative z-10">
                            <Image
                              src="/avatars/avatar1.jpeg"
                              alt="SakuraDemon"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-black font-bold text-lg uppercase">SAKURADEMON</div>
                              <Image
                                src={getBadge(2) || "/placeholder.svg"}
                                alt="Badge"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="text-black/80 text-sm">15.847 pontos</div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div className="w-6 h-6 rounded overflow-hidden">
                              <Image
                                src="/flags/argentina.png"
                                alt="Argentina"
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-gray-500 px-3 py-1 rounded-full">
                              <span className="text-white font-bold text-lg">89</span>
                            </div>
                          </div>
                        </div>

                        {/* Entry 3 */}
                        <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-full px-6 py-4 flex items-center gap-4 hover:shadow-lg transition-shadow leaderboard-item">
                          <div className="relative">
                            <Crown className="w-5 h-5 fill-amber-500 stroke-amber-700 absolute -top-2 -left-1 crown-no-line" />
                            <div className="w-8 h-8 bg-amber-900 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">#3</span>
                            </div>
                          </div>
                          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg relative z-10">
                            <Image
                              src="/avatars/avatar2.jpeg"
                              alt="NekoMaster"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-white font-bold text-lg uppercase">NEKOMASTER</div>
                              <Image
                                src={getBadge(3) || "/placeholder.svg"}
                                alt="Badge"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="text-white/80 text-sm">14.523 pontos</div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div className="w-6 h-6 rounded overflow-hidden">
                              <Image
                                src="/flags/portugal.png"
                                alt="Portugal"
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-amber-900 px-3 py-1 rounded-full">
                              <span className="text-white font-bold text-lg">76</span>
                            </div>
                          </div>
                        </div>

                        {/* Entry 4 */}
                        <div className="bg-gradient-to-r from-purple-300 to-purple-400 rounded-full px-6 py-4 flex items-center gap-4 hover:shadow-lg transition-shadow leaderboard-item">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">#4</span>
                          </div>
                          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                            <Image
                              src="/avatars/avatar3.jpeg"
                              alt="PinkAngel"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-black font-bold text-lg uppercase">PINKANGEL</div>
                              <Image
                                src={getBadge(4) || "/placeholder.svg"}
                                alt="Badge"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="text-black/80 text-sm">13.891 pontos</div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div className="w-6 h-6 rounded overflow-hidden">
                              <Image
                                src="/flags/united-states.png"
                                alt="United States"
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-purple-500 px-3 py-1 rounded-full">
                              <span className="text-white font-bold text-lg">72</span>
                            </div>
                          </div>
                        </div>

                        {/* Entries 5+ com avatar padrão */}
                        {Array.from({ length: currentlyShowing - 4 }, (_, index) => {
                          const position = index + 5
                          const player = generatePlayer(position)

                          return (
                            <div
                              key={position}
                              className={`bg-gradient-to-r ${player.color} rounded-full px-6 py-4 flex items-center gap-4 hover:shadow-lg transition-shadow leaderboard-item`}
                            >
                              <div className={`w-8 h-8 ${player.bgColor} rounded-lg flex items-center justify-center`}>
                                <span className="text-white font-bold text-sm">#{position}</span>
                              </div>
                              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                                <Image
                                  src="/avatars/default-avatar.jpeg"
                                  alt={player.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="text-black font-bold text-lg uppercase">{player.name}</div>
                                  <Image
                                    src={player.badge || "/placeholder.svg"}
                                    alt="Badge"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                  />
                                </div>
                                <div className="text-black/80 text-sm">{player.points} pontos</div>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <div className="w-6 h-6 rounded overflow-hidden">
                                  <Image
                                    src={player.flag || "/placeholder.svg"}
                                    alt="Flag"
                                    width={24}
                                    height={24}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className={`${player.bgColor} px-3 py-1 rounded-full`}>
                                  <span className="text-white font-bold text-lg">{player.level}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}

                    {/* Skeleton entries durante loading normal (carregar mais) */}
                    {isLoading && <>{Array.from({ length: 10 }, (_, index) => renderSkeletonEntry(index))}</>}

                    {/* Botão Carregar mais - só mostrar se não estiver em loading de tab */}
                    {!isTabLoading && currentlyShowing < 1000 && !isLoading && (
                      <div className="flex justify-center mb-6">
                        <button
                          onClick={loadMoreItems}
                          className="bg-blue-200 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
                        >
                          Carregar mais
                        </button>
                      </div>
                    )}

                    {/* Entry do usuário atual - DESIGN SIMPLES E LIMPO */}
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl px-6 py-4 shadow-lg mx-auto max-w-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                            <Image
                              src="/avatars/avatar4.jpeg"
                              alt="VampireQueen"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-black font-bold text-lg uppercase">SUA POSIÇÃO NO RANK É #80</div>
                            <div className="text-black/70 text-sm">8.234 pontos</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
