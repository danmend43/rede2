"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SmartColorExtractor, type VibrantColor } from "./smart-color-extractor"
import { createPortal } from "react-dom"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProfileData) => void
  initialData: ProfileData
}

interface ProfileData {
  name: string
  bio: string
  location: string
  website: string
  profileImage: string
  coverImage: string
  coverGradient: string
}

export function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData)
  const [coverGradient, setCoverGradient] = useState(initialData.coverGradient || "#9CA3AF")
  const profileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [primaryColor, setPrimaryColor] = useState("#1d9bf0")

  useEffect(() => {
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--primary-color") || "#1d9bf0"
      setPrimaryColor(color)
    }

    updateColor()

    const observer = new MutationObserver(updateColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
      setCoverGradient(initialData.coverGradient || "#9CA3AF")
    }
  }, [initialData, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
      document.body.style.height = "100vh"
      document.documentElement.style.height = "100vh"
    } else {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.height = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.height = ""
    }
  }, [isOpen])

  const extractColorsFromImage = useCallback((file: File): Promise<VibrantColor[]> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          resolve([])
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const colors = SmartColorExtractor.extractVibrantColors(imageData)
          resolve(colors)
        } catch (error) {
          console.error("Erro ao extrair cores:", error)
          resolve([])
        }
      }

      img.onerror = () => resolve([])
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const generateColorFromColors = useCallback((colors: VibrantColor[]): string => {
    if (colors.length === 0) {
      return "#9CA3AF"
    }

    const color = colors[0]
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }, [])

  const handleProfileImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }))

      try {
        const colors = await extractColorsFromImage(file)
        const solidColor = generateColorFromColors(colors)
        setCoverGradient(solidColor)
        setFormData((prev) => ({ ...prev, coverGradient: solidColor }))
      } catch (error) {
        console.error("Erro ao processar imagem:", error)
      }
    },
    [extractColorsFromImage, generateColorFromColors],
  )

  const handleCoverImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setFormData((prev) => {
      const newData = { ...prev, coverImage: imageUrl }
      return newData
    })

    setCoverGradient("")
  }, [])

  const handleRemoveCover = useCallback(() => {
    setFormData((prev) => ({ ...prev, coverImage: "" }))
    const defaultColor = "#9CA3AF"
    setCoverGradient(defaultColor)
    setFormData((prev) => ({ ...prev, coverGradient: defaultColor }))
  }, [])

  const handleInputChange = useCallback((field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = useCallback(() => {
    const dataToSave = {
      ...formData,
      coverGradient: formData.coverImage ? "" : coverGradient,
    }
    onSave(dataToSave)
    onClose()
  }, [formData, coverGradient, onSave, onClose])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          maxHeight: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 999999,
          margin: 0,
          padding: 0,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999999,
          pointerEvents: "none",
          margin: 0,
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "512px",
            maxHeight: "90vh",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit profile</h2>
            </div>
            <Button
              onClick={handleSave}
              className="text-white rounded-full px-6 font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              Save
            </Button>
          </div>

          <div
            style={{
              maxHeight: "calc(90vh - 80px)",
              overflowY: "auto",
            }}
            className="[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <div className="relative">
              <div
                className="h-48 w-full relative overflow-hidden"
                style={{
                  backgroundImage: formData.coverImage ? `url(${formData.coverImage})` : undefined,
                  backgroundColor: !formData.coverImage ? coverGradient : undefined,
                  backgroundSize: formData.coverImage ? "cover" : undefined,
                  backgroundPosition: formData.coverImage ? "center" : undefined,
                }}
              >
                <div className="absolute inset-0 bg-black/30 dark:bg-black/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      coverInputRef.current?.click()
                    }}
                    className="bg-black/50 hover:bg-black/70 rounded-full text-white"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                  {formData.coverImage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveCover}
                      className="bg-red-500/70 hover:bg-red-600/80 rounded-full text-white"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-black overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-600" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 pt-20 space-y-6 bg-white dark:bg-black">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full border-gray-200 dark:border-gray-700 rounded-lg resize-none bg-white dark:bg-black text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                  placeholder="Where are you located?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="hidden"
          />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="hidden"
          />
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
