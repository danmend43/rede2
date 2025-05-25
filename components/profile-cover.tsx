"use client"

import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface ProfileCoverProps {
  coverImage: string
  onEditProfile: () => void
}

export function ProfileCover({ coverImage, onEditProfile }: ProfileCoverProps) {
  return (
    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-2xl overflow-hidden">
      <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/20"></div>
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900"
        onClick={onEditProfile}
      >
        <Edit className="w-4 h-4 mr-2" />
        Editar perfil
      </Button>
    </div>
  )
}
