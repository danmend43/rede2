"use client"
import { useState, useEffect } from "react"
import type React from "react"

interface SearchBarProps {
  isDarkMode: boolean
  placeholder?: string
}

export default function SearchBar({ isDarkMode, placeholder = "Pesquisar..." }: SearchBarProps) {
  const [profileImage, setProfileImage] = useState("/images/new-profile.jpg")

  useEffect(() => {
    // Carregar foto salva
    const savedImage = localStorage.getItem("profileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }

    // Escutar mudanças na foto de perfil
    const handleProfileImageChange = (event: CustomEvent) => {
      setProfileImage(event.detail.newImage)
    }

    window.addEventListener("profileImageChanged", handleProfileImageChange as EventListener)

    return () => {
      window.removeEventListener("profileImageChanged", handleProfileImageChange as EventListener)
    }
  }, [])

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"
      } p-4 border-b fixed top-0 left-[76px] right-0 z-30 backdrop-blur-md bg-opacity-95`}
    >
      <div className="flex items-center justify-between">
        <div className="relative w-[350px]">
          <i className="bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-2 border ${
              isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"
            } rounded-full focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
            style={{ "--tw-ring-color": "#00AEEC" } as React.CSSProperties}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-full p-0.5 ${isDarkMode ? "border border-gray-600" : "border border-gray-300"}`}
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <img src={profileImage || "/placeholder.svg"} alt="Perfil" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
