interface LevelBadgeProps {
  level: number
}

const getLevelColors = (level: number) => {
  const tier = Math.floor(level / 10)
  const colorSchemes = [
    { bg: "bg-gradient-to-r from-yellow-300 to-yellow-500", text: "text-black" },
    { bg: "bg-gradient-to-r from-red-400 to-red-600", text: "text-white" },
    { bg: "bg-gradient-to-r from-blue-400 to-blue-600", text: "text-white" },
    { bg: "bg-gradient-to-r from-green-400 to-green-600", text: "text-white" },
    { bg: "bg-gradient-to-r from-purple-400 to-purple-600", text: "text-white" },
  ]
  return colorSchemes[tier] || { bg: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500", text: "text-white" }
}

export default function LevelBadge({ level }: LevelBadgeProps) {
  const colors = getLevelColors(level)
  return (
    <div
      className={`${colors.bg} ${colors.text} text-xs font-bold flex items-center justify-center leading-none h-[1.2em] px-1 rounded-md shadow-sm`}
    >
      <span>LV{level}</span>
    </div>
  )
}
