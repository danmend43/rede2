interface VerificationBadgeProps {
  type: "green" | "blue" | "yellow" | null
}

export default function VerificationBadge({ type }: VerificationBadgeProps) {
  if (!type) return null

  const badgeImages = {
    green: "/images/badges/verified-green.png",
    blue: "/images/badges/verified-blue.png",
    yellow: "/images/badges/verified-yellow.png",
  }

  return (
    <img
      src={badgeImages[type] || "/placeholder.svg"}
      alt={`${type} verification badge`}
      className="w-4 h-4 ml-1 flex-shrink-0"
    />
  )
}
