"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserProfile } from "@/hooks/use-profile"
import { X, Edit } from "lucide-react"

interface EditProfileModalProps {
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
  coverImage: string
  setCoverImage: (image: string) => void
  avatarImage: string
  setAvatarImage: (image: string) => void
  onClose: () => void
}

export function EditProfileModal({
  userProfile,
  setUserProfile,
  coverImage,
  setCoverImage,
  avatarImage,
  setAvatarImage,
  onClose,
}: EditProfileModalProps) {
  const [editingName, setEditingName] = useState(userProfile.name)
  const [editingBio, setEditingBio] = useState(userProfile.bio)
  const [tempCoverImage, setTempCoverImage] = useState(coverImage)
  const [tempAvatarImage, setTempAvatarImage] = useState(avatarImage)
  const [useBlurredAvatar, setUseBlurredAvatar] = useState(false)
  const [blurAmount, setBlurAmount] = useState(10)

  const tempCoverInputRef = useRef<HTMLInputElement>(null)
  const tempAvatarInputRef = useRef<HTMLInputElement>(null)

  const handleTempCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempCoverImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTempAvatarImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempAvatarImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setUserProfile({
      ...userProfile,
      name: editingName,
      bio: editingBio,
    })

    if (useBlurredAvatar) {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx!.filter = `blur(${blurAmount}px)`
        ctx!.drawImage(img, 0, 0)
        const blurredDataUrl = canvas.toDataURL()
        setCoverImage(blurredDataUrl)
      }

      img.src = tempAvatarImage
    } else {
      setCoverImage(tempCoverImage)
    }

    setAvatarImage(tempAvatarImage)
    onClose()
  }

  const handleCancel = () => {
    setTempCoverImage(coverImage)
    setTempAvatarImage(avatarImage)
    setEditingName(userProfile.name)
    setEditingBio(userProfile.bio)
    setUseBlurredAvatar(false)
    setBlurAmount(10)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Editar Perfil</h2>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Cover Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa</label>

              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useBlurredAvatar}
                    onChange={(e) => setUseBlurredAvatar(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Usar foto de perfil como capa com desfoque</span>
                </label>
              </div>

              {useBlurredAvatar ? (
                <div className="space-y-4">
                  <div className="relative h-32 rounded-xl overflow-hidden">
                    <img
                      src={tempAvatarImage || "/placeholder.svg"}
                      alt="Cover preview with blur"
                      className="w-full h-full object-cover"
                      style={{ filter: `blur(${blurAmount}px)` }}
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-2 right-2 bg-white/90 text-gray-900 text-xs px-2 py-1 rounded">
                      Desfoque: {blurAmount}px
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Intensidade do desfoque: {blurAmount}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={blurAmount}
                      onChange={(e) => setBlurAmount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Sem desfoque</span>
                      <span>Máximo desfoque</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden">
                  <img
                    src={tempCoverImage || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-900"
                    onClick={() => tempCoverInputRef.current?.click()}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Alterar
                  </Button>
                </div>
              )}
            </div>

            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
                  <Avatar className="w-full h-full border-2 border-white">
                    <AvatarImage src={tempAvatarImage || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">U</AvatarFallback>
                  </Avatar>
                </div>
                <Button
                  variant="outline"
                  onClick={() => tempAvatarInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Alterar foto
                </Button>
              </div>
            </div>

            {/* Name Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Seu nome"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Bio Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biografia</label>
              <Textarea
                value={editingBio}
                onChange={(e) => setEditingBio(e.target.value)}
                placeholder="Conte um pouco sobre você..."
                className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                maxLength={300}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{editingBio.length}/300</div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={tempCoverInputRef}
        onChange={handleTempCoverImageChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={tempAvatarInputRef}
        onChange={handleTempAvatarImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
