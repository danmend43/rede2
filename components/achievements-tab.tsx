import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Upload, MessageCircle, TrendingUp } from "lucide-react"

export function AchievementsTab() {
  const achievements = [
    {
      name: "Primeiro Milhão",
      description: "Primeiro vídeo a atingir 1M de visualizações",
      icon: Trophy,
      date: "Janeiro 2024",
      rarity: "legendary",
    },
    {
      name: "Criador Consistente",
      description: "100 vídeos publicados",
      icon: Upload,
      date: "Dezembro 2023",
      rarity: "epic",
    },
    {
      name: "Comunidade Ativa",
      description: "10K comentários respondidos",
      icon: MessageCircle,
      date: "Novembro 2023",
      rarity: "rare",
    },
    {
      name: "Trending Master",
      description: "10 vídeos em trending",
      icon: TrendingUp,
      date: "Outubro 2023",
      rarity: "epic",
    },
  ]

  const getRarityColor = (rarity: string) => {
    const colors = {
      legendary: "border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50",
      epic: "border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50",
      rare: "border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50",
      common: "border-gray-400 bg-gray-50",
    }
    return colors[rarity] || colors.common
  }

  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Trophy className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhuma conquista ainda</h3>
        <p className="text-sm text-center">Continue criando conteúdo para desbloquear conquistas!</p>
      </div>
    )
  }

  return (
    <div className="min-h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 transform hover:scale-105 ${getRarityColor(achievement.rarity)}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <achievement.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
