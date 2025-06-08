"use client"
import { TopNav } from "@/components/top-nav"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import ProfilePage from "@/components/profile-page"
import { useEffect } from "react"

export default function HomePage() {
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

      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <TopNav />
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
