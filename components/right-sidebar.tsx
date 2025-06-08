"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SmartColorExtractor } from "@/components/smart-color-extractor"
import { useState, useEffect, useRef } from "react"

interface RightSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Componente de ícone do Spotify
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

export function RightSidebar({ className, ...props }: RightSidebarProps) {
  const [currentTime, setCurrentTime] = useState(21) // 0:21
  const [duration] = useState(192) // 3:12
  const [gradientColors, setGradientColors] = useState(
    "linear-gradient(to bottom left, rgb(29, 185, 84), rgb(25, 20, 20))",
  )
  const [isSpotifyExpanded, setIsSpotifyExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false)
  const [currentSpotifyTrack, setCurrentSpotifyTrack] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Verificar se o Spotify está conectado
  useEffect(() => {
    const checkSpotifyConnection = () => {
      const spotifyToken = localStorage.getItem("spotify_token")
      setIsSpotifyConnected(!!spotifyToken)
    }

    checkSpotifyConnection()

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      checkSpotifyConnection()
    }

    window.addEventListener("storage", handleStorageChange)

    // Verificar periodicamente (para mudanças na mesma aba)
    const interval = setInterval(checkSpotifyConnection, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Buscar música atual do Spotify
  useEffect(() => {
    if (!isSpotifyConnected) return

    const fetchCurrentTrack = async () => {
      const token = localStorage.getItem("spotify_token")
      if (!token) return

      try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok && response.status !== 204) {
          const data = await response.json()
          if (data && data.item) {
            setCurrentSpotifyTrack(data.item)
            setIsPlaying(data.is_playing || false)

            // Extrair cores da imagem do álbum
            if (data.item.album?.images?.[0]?.url) {
              extractSpotifyAlbumColors(data.item.album.images[0].url)
            }
          }
        } else if (response.status === 204) {
          setCurrentSpotifyTrack(null)
          setIsPlaying(false)
        }
      } catch (error) {
        console.error("Erro ao buscar música atual:", error)
      }
    }

    fetchCurrentTrack()
    const interval = setInterval(fetchCurrentTrack, 5000) // Verificar a cada 5 segundos

    return () => clearInterval(interval)
  }, [isSpotifyConnected])

  // Extract colors from album cover
  const extractSpotifyAlbumColors = (imageUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

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

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = SmartColorExtractor.extractVibrantColors(imageData)

        if (colors.length >= 2) {
          const color1 = colors[0]
          const color2 = colors[1]

          // Criar versões mais escuras para o gradiente
          const darkPrimary = `rgb(${Math.round(color1.r * 0.4)}, ${Math.round(color1.g * 0.4)}, ${Math.round(color1.b * 0.4)})`
          const lightSecondary = `rgb(${Math.round(color2.r * 0.6)}, ${Math.round(color2.g * 0.6)}, ${Math.round(color2.b * 0.6)})`

          const gradient = `linear-gradient(to bottom left, ${lightSecondary}, ${darkPrimary})`
          setGradientColors(gradient)
        } else if (colors.length === 1) {
          const color1 = colors[0]
          const rgb1 = `rgb(${color1.r}, ${color1.g}, ${color1.b})`

          // Criar uma segunda cor mais escura
          const darkerR = Math.max(0, color1.r - 40)
          const darkerG = Math.max(0, color1.g - 40)
          const darkerB = Math.max(0, color1.b - 40)
          const rgb2 = `rgb(${darkerR}, ${darkerG}, ${darkerB})`

          const gradient = `linear-gradient(to bottom left, ${rgb1}, ${rgb2})`
          setGradientColors(gradient)
        }
      } catch (error) {
        console.error("Error extracting colors:", error)
      }
    }

    img.src = imageUrl
  }

  // Simulate time progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1
        if (newTime >= duration) {
          return 0 // Reset to start
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <aside className={cn("w-72 shrink-0 flex flex-col h-[calc(100vh-7rem)] sticky top-28", className)} {...props}>
      <canvas ref={canvasRef} className="hidden" />

      <div className="space-y-4 overflow-y-auto flex-grow">
        {/* Spotify Player - só mostra quando conectado e há música tocando */}
        {isSpotifyConnected && currentSpotifyTrack && (
          <Card
            className={`relative overflow-hidden border border-gray-200 dark:border-gray-900 transition-all duration-500 ease-in-out ${
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
                  ? gradientColors
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
              className={`relative z-10 transition-all duration-500 ease-in-out ${isSpotifyExpanded ? "p-3" : "p-2"}`}
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
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? "bg-[#1DB954]" : "bg-orange-400"}`}
                  ></div>
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-white text-sm font-medium flex-shrink-0 mr-1">
                      {isPlaying ? "Ouvindo" : "Pausado"} -
                    </span>
                    <div className="overflow-hidden flex-1 relative">
                      <div className="text-white text-sm font-medium truncate">{currentSpotifyTrack.name}</div>
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
                        <p className="font-medium text-white text-sm drop-shadow-sm truncate">
                          {currentSpotifyTrack.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-100 truncate opacity-90">
                        {currentSpotifyTrack.artists?.map((artist: any) => artist.name).join(", ")}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-[#1DB954]" : "bg-orange-400"}`}></div>
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
                          width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-100 opacity-90">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
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

        {/* Mensagem quando Spotify está conectado mas não há música tocando */}
        {isSpotifyConnected && !currentSpotifyTrack && (
          <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <SpotifyIcon className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Spotify conectado</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Toque uma música para vê-la aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outras sugestões */}
        <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Sugestões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aqui eu coloco alguma coisa, to sem ideias..
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-4 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-900">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
          <a href="#" className="hover:underline">
            Termos
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Privacidade
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Ajuda
          </a>
        </div>
        <p>© 2024 Bilibili, Inc.</p>
      </footer>
    </aside>
  )
}
