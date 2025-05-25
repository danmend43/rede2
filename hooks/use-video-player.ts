"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const currentSrcRef = useRef<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadVideo = useCallback(async (src: string) => {
    if (!videoRef.current || !src || currentSrcRef.current === src) return

    console.log("Loading video:", src)
    currentSrcRef.current = src
    setIsLoading(true)
    setError(null)

    try {
      // Cleanup previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      const video = videoRef.current

      // Check if it's an HLS stream
      if (src.includes(".m3u8")) {
        const Hls = (await import("hls.js")).default

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: false,
            lowLatencyMode: true,
            debug: false,
          })

          hlsRef.current = hls

          hls.loadSource(src)
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("HLS manifest parsed")
            setIsLoading(false)
          })

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error:", data)
            setError("Erro ao carregar vídeo HLS")
            setIsLoading(false)
          })
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari native HLS support
          video.src = src
          setIsLoading(false)
        } else {
          setError("HLS não suportado neste navegador")
          setIsLoading(false)
        }
      } else {
        // Regular video file - use blob URL directly
        video.src = src

        // Wait for the video to load
        const handleLoadedData = () => {
          console.log("Video loaded successfully")
          setIsLoading(false)
          video.removeEventListener("loadeddata", handleLoadedData)
          video.removeEventListener("error", handleError)
        }

        const handleError = (e: any) => {
          console.error("Video load error:", e)
          setError("Erro ao carregar vídeo")
          setIsLoading(false)
          video.removeEventListener("loadeddata", handleLoadedData)
          video.removeEventListener("error", handleError)
        }

        video.addEventListener("loadeddata", handleLoadedData)
        video.addEventListener("error", handleError)

        // Force load
        video.load()
      }
    } catch (error) {
      console.error("Error in loadVideo:", error)
      setError("Erro ao inicializar vídeo")
      setIsLoading(false)
    }
  }, [])

  const play = useCallback(async () => {
    if (videoRef.current && !isLoading) {
      try {
        await videoRef.current.play()
        setIsPlaying(true)
        setError(null)
      } catch (error) {
        console.error("Error playing video:", error)
        setError("Erro ao reproduzir vídeo")
      }
    }
  }, [isLoading])

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  const seek = useCallback(
    (time: number) => {
      if (videoRef.current && !isLoading) {
        videoRef.current.currentTime = time
        setCurrentTime(time)
      }
    },
    [isLoading],
  )

  const setVolumeLevel = useCallback((level: number) => {
    if (videoRef.current) {
      videoRef.current.volume = level
      setVolume(level)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
      currentSrcRef.current = ""
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (!isLoading) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration)
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    const handleLoadStart = () => setIsLoading(true)

    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }

    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => setIsLoading(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [isLoading])

  return {
    videoRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    loadVideo,
    play,
    pause,
    togglePlay,
    seek,
    setVolumeLevel,
  }
}
