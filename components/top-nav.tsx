"use client"
import { Bell, Search, Upload, ChevronDown, ChevronRight, ChevronLeft, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import Link from "next/link"

type Theme = "light" | "dark" | "system"
type ColorTheme = "blue" | "purple" | "green" | "orange" | "red" | "pink"

interface ColorConfig {
  name: string
  primary: string
  primaryHover: string
  primaryLight: string
  gradient: string
}

const colorThemes: Record<ColorTheme, ColorConfig> = {
  blue: {
    name: "Azul",
    primary: "#1d9bf0",
    primaryHover: "#1a8cd8",
    primaryLight: "#1d9bf0",
    gradient: "from-blue-500 to-cyan-500",
  },
  purple: {
    name: "Roxo",
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    primaryLight: "#8b5cf6",
    gradient: "from-purple-500 to-violet-500",
  },
  green: {
    name: "Verde",
    primary: "#10b981",
    primaryHover: "#059669",
    primaryLight: "#10b981",
    gradient: "from-green-500 to-emerald-500",
  },
  orange: {
    name: "Laranja",
    primary: "#f59e0b",
    primaryHover: "#d97706",
    primaryLight: "#f59e0b",
    gradient: "from-orange-500 to-amber-500",
  },
  red: {
    name: "Vermelho",
    primary: "#ef4444",
    primaryHover: "#dc2626",
    primaryLight: "#ef4444",
    gradient: "from-red-500 to-rose-500",
  },
  pink: {
    name: "Rosa",
    primary: "#ec4899",
    primaryHover: "#db2777",
    primaryLight: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
  },
}

// Componente de ícone do Spotify
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

// Componente de ícone do SoundCloud
const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.104.101.104.053 0 .094-.046.101-.104l.262-2.105-.262-2.154c-.007-.058-.048-.1-.101-.1m1.49.876c-.053 0-.094.046-.101.104l-.203 1.278.203 1.25c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.232-1.25-.232-1.278c-.007-.058-.05-.104-.101-.104m1.49-1.136c-.053 0-.094.046-.101.104l-.174 2.414.174 2.383c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.203-2.383-.203-2.414c-.007-.058-.05-.104-.101-.104m1.49-.8c-.053 0-.094.046-.101.104l-.145 3.214.145 3.125c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.174-3.125-.174-3.214c-.007-.058-.05-.104-.101-.104m1.49-.417c-.053 0-.094.046-.101.104l-.116 3.631.116 3.533c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.145-3.533-.145-3.631c-.007-.058-.05-.104-.101-.104m1.49-.139c-.053 0-.094.046-.101.104l-.087 3.77.087 3.672c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.116-3.672-.116-3.77c-.007-.058-.05-.104-.101-.104m1.49.278c-.053 0-.094.046-.101.104l-.058 3.492.058 3.394c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.087-3.394-.087-3.492c-.007-.058-.05-.104-.101-.104m1.49-.556c-.053 0-.094.046-.101.104l-.029 4.048.029 3.95c.007.058.048.104.101.104.051 0 .094-.046.101-.104l.058-3.95-.058-4.048c-.007-.058-.05-.104-.101-.104m1.49-.834c-.053 0-.094.046-.101.104v8.002c.007.058.048.104.101.104.051 0 .094-.046.101-.104v-8.002c-.007-.058-.05-.104-.101-.104m1.49-.278c-.053 0-.094.046-.101.104l.029 4.326-.029 4.187c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.029-4.187.029-4.326c-.007-.058-.05-.104-.101-.104m1.49.556c-.053 0-.094.046-.101.104l.058 3.77-.058 3.631c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.058-3.631.058-3.77c-.007-.058-.05-.104-.101-.104m1.49.834c-.053 0-.094.046-.101.104l.087 2.936-.087 2.797c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.087-2.797.087-2.936c-.007-.058-.05-.104-.101-.104m1.49.695c-.053 0-.094.046-.101.104l.116 2.241-.116 2.133c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.116-2.133.116-2.241c-.007-.058-.05-.104-.101-.104m1.49.417c-.053 0-.094.046-.101.104l.145 1.824-.145 1.746c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.145-1.746.145-1.824c-.007-.058-.05-.104-.101-.104m1.49.278c-.053 0-.094.046-.101.104l.174 1.546-.174 1.468c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.174-1.468.174-1.546c-.007-.058-.05-.104-.101-.104m1.49.139c-.053 0-.094.046-.101.104l.203 1.407-.203 1.329c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.203-1.329.203-1.407c-.007-.058-.05-.104-.101-.104m1.49-.139c-.053 0-.094.046-.101.104l.232 1.546-.232 1.468c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.232-1.468.232-1.546c-.007-.058-.05-.104-.101-.104m1.49-.278c-.053 0-.094.046-.101.104l.262 1.824-.262 1.746c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.262-1.746.262-1.824c-.007-.058-.05-.104-.101-.104m1.49-.417c-.053 0-.094.046-.101.104l.291 2.241-.291 2.133c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.291-2.133.291-2.241c-.007-.058-.05-.104-.101-.104m1.49-.695c-.053 0-.094.046-.101.104l.32 2.936-.32 2.797c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.32-2.797.32-2.936c-.007-.058-.05-.104-.101-.104m1.49-.834c-.053 0-.094.046-.101.104l.349 3.77-.349 3.631c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.349-3.631.349-3.77c-.007-.058-.05-.104-.101-.104m1.49-.278c-.053 0-.094.046-.101.104l.378 4.048-.378 3.95c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.378-3.95.378-4.048c-.007-.058-.05-.104-.101-.104m1.49.556c-.053 0-.094.046-.101.104l.407 3.492-.407 3.394c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.407-3.394.407-3.492c-.007-.058-.05-.104-.101-.104m1.49.139c-.053 0-.094.046-.101.104l.436 3.353-.436 3.255c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.436-3.255.436-3.353c-.007-.058-.05-.104-.101-.104m1.49.417c-.053 0-.094.046-.101.104l.465 2.936-.465 2.797c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.465-2.797.465-2.936c-.007-.058-.05-.104-.101-.104m1.49.695c-.053 0-.094.046-.101.104l.494 2.241-.494 2.133c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.494-2.133.494-2.241c-.007-.058-.05-.104-.101-.104m1.49.834c-.053 0-.094.046-.101.104l.523 1.546-.523 1.468c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.523-1.468.523-1.546c-.007-.058-.05-.104-.101-.104m1.49.278c-.053 0-.094.046-.101.104l.552 1.268-.552 1.19c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.552-1.19.552-1.268c-.007-.058-.05-.104-.101-.104m1.49.139c-.053 0-.094.046-.101.104l.581.99-.581.912c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.581-.912.581-.99c-.007-.058-.05-.104-.101-.104m1.49.278c-.053 0-.094.046-.101.104l.61.712-.61.634c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.61-.634.61-.712c-.007-.058-.05-.104-.101-.104m1.49.417c-.053 0-.094.046-.101.104l.639.434-.639.356c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.639-.356.639-.434c-.007-.058-.05-.104-.101-.104m1.49.695c-.053 0-.094.046-.101.104l.668.156-.668.078c.007.058.048.104.101.104.051 0 .094-.046.101-.104l-.668-.078.668-.156c-.007-.058-.05-.104-.101-.104" />
  </svg>
)

// Componente de ícone do Deezer
const DeezerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.81 8.86h2.915v1.31H18.81zm0 2.19h2.915v1.31H18.81zm0 2.19h2.915v1.31H18.81zm0 2.19h2.915v1.31H18.81zm-3.65-6.57h2.915v1.31H15.16zm0 2.19h2.915v1.31H15.16zm0 2.19h2.915v1.31H15.16zm0 2.19h2.915v1.31H15.16zm0 2.19h2.915v1.31H15.16zm-3.65-8.76h2.915v1.31H11.51zm0 2.19h2.915v1.31H11.51zm0 2.19h2.915v1.31H11.51zm0 2.19h2.915v1.31H11.51zm0 2.19h2.915v1.31H11.51zm0 2.19h2.915v1.31H11.51zm-3.65-10.95h2.915v1.31H7.86zm0 2.19h2.915v1.31H7.86zm0 2.19h2.915v1.31H7.86zm0 2.19h2.915v1.31H7.86zm0 2.19h2.915v1.31H7.86zm0 2.19h2.915v1.31H7.86zm0 2.19h2.915v1.31H7.86zm-3.65-13.14h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21zm0 2.19h2.915v1.31H4.21z" />
  </svg>
)

export function TopNav() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userMenuSection, setUserMenuSection] = useState("main")
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [theme, setTheme] = useState<Theme>("light")
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue")
  const [profileImage, setProfileImage] = useState("/images/new-default-avatar.png")
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false)

  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail.profileImage) {
        setProfileImage(event.detail.profileImage)
      }
    }

    window.addEventListener("profileUpdated", handleProfileUpdate as EventListener)

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme

    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      setTheme("system")
      applyTheme("system")
    }

    if (savedColorTheme) {
      setColorTheme(savedColorTheme)
      applyColorTheme(savedColorTheme)
    } else {
      applyColorTheme("blue")
    }

    // Verificar se o Spotify está conectado
    const spotifyToken = localStorage.getItem("spotify_token")
    setIsSpotifyConnected(!!spotifyToken)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  const applyColorTheme = (newColorTheme: ColorTheme) => {
    const root = document.documentElement
    const config = colorThemes[newColorTheme]

    root.style.setProperty("--primary-color", config.primary)
    root.style.setProperty("--primary-hover", config.primaryHover)
    root.style.setProperty("--primary-light", config.primaryLight)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleColorThemeChange = (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme)
    localStorage.setItem("colorTheme", newColorTheme)
    applyColorTheme(newColorTheme)
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
    setIsSpotifyConnected(false)
    // Recarregar a página para atualizar o estado
    window.location.reload()
  }

  const getThemeIcon = (themeOption: Theme) => {
    switch (themeOption) {
      case "light":
        return <Sun className="w-4 h-4" />
      case "dark":
        return <Moon className="w-4 h-4" />
      case "system":
        return <Monitor className="w-4 h-4" />
    }
  }

  const getThemeLabel = (themeOption: Theme) => {
    switch (themeOption) {
      case "light":
        return "Modo Claro"
      case "dark":
        return "Modo Escuro"
      case "system":
        return "Sistema"
    }
  }

  const currentColor = colorThemes[colorTheme]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-3 pl-6">
                <Link href="/" className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: currentColor.primary }}
                  >
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Bilibili</span>
                </Link>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  placeholder="Buscar..."
                  className="pl-4 pr-10 py-2 rounded-full border-gray-200 dark:border-gray-900 bg-white dark:bg-black text-gray-900 dark:text-white"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-white"
                  style={{ backgroundColor: currentColor.primary }}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="border font-medium"
                style={{
                  backgroundColor: `${currentColor.primary}10`,
                  borderColor: `${currentColor.primary}20`,
                  color: currentColor.primary,
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Criar Post
              </Button>
              <Button variant="outline" size="sm" className="dark:border-gray-900 dark:bg-gray-900 dark:text-gray-300">
                <Bell className="w-4 h-4" />
              </Button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profileImage || "/placeholder.svg"} alt="Avatar" />
                    <AvatarFallback
                      className="text-white font-semibold"
                      style={{ backgroundColor: currentColor.primary }}
                    >
                      EU
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-2xl z-[99999] overflow-hidden">
                    {userMenuSection === "main" && (
                      <div className="p-4">
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mb-2">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={profileImage || "/placeholder.svg"} alt="Avatar" />
                            <AvatarFallback
                              className="text-white font-semibold"
                              style={{ backgroundColor: currentColor.primary }}
                            >
                              EU
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">Meu Nome</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Ver seu perfil</div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                          <button
                            onClick={() => setUserMenuSection("settings")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">
                              Configurações e privacidade
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("appearance")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Aparência</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("connectivity")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Conectividade</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("help")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Ajuda e suporte</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                              <span className="text-gray-900 dark:text-white font-medium text-sm">Sair</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "settings" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Configurações e privacidade</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Configurações</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Privacidade</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Notificações</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "appearance" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Aparência</span>
                        </button>

                        <div className="space-y-6">
                          <div className="px-3 py-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tema</h4>
                            <div className="space-y-2">
                              {(["light", "dark", "system"] as Theme[]).map((themeOption) => (
                                <button
                                  key={themeOption}
                                  onClick={() => handleThemeChange(themeOption)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                    theme === themeOption
                                      ? "border"
                                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                                  }`}
                                  style={
                                    theme === themeOption
                                      ? {
                                          backgroundColor: `${currentColor.primary}10`,
                                          color: currentColor.primary,
                                          borderColor: `${currentColor.primary}20`,
                                        }
                                      : {}
                                  }
                                >
                                  {getThemeIcon(themeOption)}
                                  <span className="text-sm font-medium">{getThemeLabel(themeOption)}</span>
                                  {theme === themeOption && (
                                    <div
                                      className="ml-auto w-2 h-2 rounded-full"
                                      style={{ backgroundColor: currentColor.primary }}
                                    ></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="px-3 py-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Cor do tema</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {(Object.keys(colorThemes) as ColorTheme[]).map((color) => {
                                const config = colorThemes[color]
                                return (
                                  <button
                                    key={color}
                                    onClick={() => handleColorThemeChange(color)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                      colorTheme === color ? "ring-2 ring-offset-2 dark:ring-offset-gray-900" : ""
                                    }`}
                                    style={
                                      colorTheme === color
                                        ? {
                                            ringColor: config.primary,
                                          }
                                        : {}
                                    }
                                  >
                                    <div
                                      className="w-8 h-8 rounded-full shadow-sm"
                                      style={{ backgroundColor: config.primary }}
                                    ></div>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                      {config.name}
                                    </span>
                                    {colorTheme === color && (
                                      <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: config.primary }}
                                      ></div>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "connectivity" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Conectividade</span>
                        </button>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Plataformas de música
                          </h4>

                          {/* Spotify */}
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <SpotifyIcon className="w-5 h-5 text-green-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Spotify</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {isSpotifyConnected ? "Conectado" : "Não conectado"}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={isSpotifyConnected ? "outline" : "default"}
                              onClick={isSpotifyConnected ? handleSpotifyDisconnect : handleSpotifyConnect}
                              className={
                                isSpotifyConnected
                                  ? "text-red-600 hover:text-red-700"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }
                            >
                              {isSpotifyConnected ? "Desconectar" : "Conectar"}
                            </Button>
                          </div>

                          {/* SoundCloud */}
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg opacity-50">
                            <div className="flex items-center gap-3">
                              <SoundCloudIcon className="w-5 h-5 text-orange-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">SoundCloud</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Em breve</p>
                              </div>
                            </div>
                            <Button size="sm" disabled className="text-gray-400">
                              Em breve
                            </Button>
                          </div>

                          {/* Deezer */}
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg opacity-50">
                            <div className="flex items-center gap-3">
                              <DeezerIcon className="w-5 h-5 text-purple-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Deezer</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Em breve</p>
                              </div>
                            </div>
                            <Button size="sm" disabled className="text-gray-400">
                              Em breve
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {userMenuSection === "help" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Ajuda e suporte</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Central de ajuda</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Entrar em contato</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Reportar problema</span>
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

        {(showMegaMenu || showUserMenu) && (
          <div
            className="fixed inset-0 bg-black/20 z-[99998]"
            onClick={() => {
              setShowMegaMenu(false)
              setShowUserMenu(false)
              setUserMenuSection("main")
            }}
          />
        )}
      </header>
    </>
  )
}
