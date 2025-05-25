"use client"

interface AvatarModalProps {
  avatarImage: string
  onClose: () => void
}

export function AvatarModal({ avatarImage, onClose }: AvatarModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-md max-h-[80vh]">
        <img
          src={avatarImage || "/placeholder.svg"}
          alt="Profile"
          className="max-w-full max-h-full object-contain rounded-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
