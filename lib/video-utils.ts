export function detectYouTubeUrl(text: string): string | null {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g
  const match = youtubeRegex.exec(text)
  return match ? match[0] : null
}

export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null
}

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Seek to 1 second or 10% of video duration
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
        resolve(thumbnail)
      } else {
        reject(new Error("Could not get canvas context"))
      }
    }

    video.onerror = () => reject(new Error("Error loading video"))

    video.src = URL.createObjectURL(file)
  })
}

export function getVideoDuration(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")

    video.onloadedmetadata = () => {
      const duration = video.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`)
      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => {
      reject(new Error("Error loading video"))
      URL.revokeObjectURL(video.src)
    }

    video.src = URL.createObjectURL(file)
  })
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
