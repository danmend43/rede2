"use client"

import { useState, useEffect } from "react"

interface SpotifyUser {
  id: string
  name: string
  email: string
  image?: string
  followers: number
  access_token: string
  refresh_token: string
}

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
  preview_url?: string
}

interface CurrentlyPlaying {
  is_playing: boolean
  item: SpotifyTrack | null
  progress_ms: number
  device?: {
    name: string
    type: string
  }
}

export function useSpotify() {
  const [user, setUser] = useState<SpotifyUser | null>(null)
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([])
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for Spotify data in URL params (from callback)
    const urlParams = new URLSearchParams(window.location.search)
    const spotifyData = urlParams.get("spotify_data")

    if (spotifyData) {
      try {
        const userData = JSON.parse(Buffer.from(spotifyData, "base64").toString())
        setUser(userData)
        localStorage.setItem("spotify_user", JSON.stringify(userData))

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)

        // Fetch additional data
        fetchUserData(userData.access_token)
      } catch (error) {
        console.error("Error parsing Spotify data:", error)
      }
    } else {
      // Check localStorage for existing user
      const savedUser = localStorage.getItem("spotify_user")
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          fetchUserData(userData.access_token)
        } catch (error) {
          console.error("Error loading saved user:", error)
          localStorage.removeItem("spotify_user")
        }
      }
    }
  }, [])

  // Poll currently playing track every 30 seconds
  useEffect(() => {
    if (!user?.access_token) return

    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })

        if (response.status === 200) {
          const data = await response.json()
          setCurrentlyPlaying(data)
        } else if (response.status === 204) {
          // No content - nothing is playing
          setCurrentlyPlaying({ is_playing: false, item: null, progress_ms: 0 })
        }
      } catch (error) {
        console.error("Error fetching currently playing:", error)
      }
    }

    // Fetch immediately
    fetchCurrentlyPlaying()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 30000)

    return () => clearInterval(interval)
  }, [user?.access_token])

  const fetchUserData = async (accessToken: string) => {
    setLoading(true)
    try {
      // Fetch top tracks
      const topTracksResponse = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (topTracksResponse.ok) {
        const topTracksData = await topTracksResponse.json()
        setTopTracks(topTracksData.items)
      }

      // Fetch recent tracks
      const recentTracksResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (recentTracksResponse.ok) {
        const recentTracksData = await recentTracksResponse.json()
        setRecentTracks(recentTracksData.items.map((item: any) => item.track))
      }

      // Fetch currently playing
      const currentlyPlayingResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (currentlyPlayingResponse.status === 200) {
        const currentlyPlayingData = await currentlyPlayingResponse.json()
        setCurrentlyPlaying(currentlyPlayingData)
      } else if (currentlyPlayingResponse.status === 204) {
        // No content - nothing is playing
        setCurrentlyPlaying({ is_playing: false, item: null, progress_ms: 0 })
      }
    } catch (error) {
      console.error("Error fetching Spotify data:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = "/api/spotify/login"
  }

  const logout = () => {
    setUser(null)
    setTopTracks([])
    setRecentTracks([])
    setCurrentlyPlaying(null)
    localStorage.removeItem("spotify_user")
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return {
    user,
    topTracks,
    recentTracks,
    currentlyPlaying,
    loading,
    login,
    logout,
    formatDuration,
    isAuthenticated: !!user,
  }
}
