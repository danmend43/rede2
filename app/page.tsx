"use client"
import { TopNav } from "@/components/top-nav"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import ProfilePage from "@/components/profile-page"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    // Verificar se há tokens do Spotify na URL
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get("access_token")
    const refreshToken = urlParams.get("refresh_token")

    if (accessToken) {
      localStorage.setItem("spotify_token", accessToken)
      if (refreshToken) {
        localStorage.setItem("spotify_refresh_token", refreshToken)
      }

      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)

      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <TopNav />

      {/* Mensagem de sucesso do Spotify */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right">
          🎵 Spotify conectado com sucesso!
        </div>
      )}

      <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
        <LeftSidebar className="hidden md:block" />
        <div className="flex-1">
          <ProfilePage />
        </div>
        <RightSidebar className="hidden lg:block" />
      </div>
    </div>
  )
}
