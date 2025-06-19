"use client"

import { useEffect, useState } from "react"

export default function PostSkeleton() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem("theme")
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(theme === "dark" || (!theme && systemDark))
    }

    checkTheme()

    // Listen for theme changes
    const handleStorageChange = () => checkTheme()
    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const skeletonBg = isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-300"
  const containerBg = isDarkMode ? "bg-[#09090b]" : "bg-white"
  const borderColor = isDarkMode ? "border-[#27272a]" : "border-gray-200"
  const borderTopColor = isDarkMode ? "border-[#0f0f0f]" : "border-gray-100"

  return (
    <div
      className={`${containerBg} rounded-2xl border ${borderColor} shadow-sm overflow-hidden mb-4 p-4 animate-pulse`}
    >
      {/* Header skeleton */}
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${skeletonBg}`}></div>
        <div className="flex-1">
          <div className={`h-4 ${skeletonBg} rounded w-32 mb-1`}></div>
          <div className={`h-3 ${skeletonBg} rounded w-20`}></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className={`h-4 ${skeletonBg} rounded w-full`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-3/4`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-1/2`}></div>
      </div>

      {/* Image skeleton */}
      <div className={`h-64 ${skeletonBg} rounded-2xl mb-4`}></div>

      {/* Stats skeleton */}
      <div className={`flex items-center space-x-8 pt-2 border-t ${borderTopColor}`}>
        <div className={`h-4 ${skeletonBg} rounded w-12`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-12`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-12`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-8`}></div>
      </div>
    </div>
  )
}
