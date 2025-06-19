interface HighlightsProps {
  isDarkMode: boolean
}

const highlights = [
  {
    id: 1,
    type: "trending",
    title: "Demon Slayer: Temporada 4 Confirmada!",
    description: "A Ufotable confirmou oficialmente a produção da quarta temporada de Demon Slayer",
    image: "/images/anime-profiles/cozy-girl.jpg",
    engagement: "2.3k curtidas • 456 comentários",
    time: "há 1 hora",
  },
  {
    id: 2,
    type: "achievement",
    title: "Comunidade Atingiu 25k Membros!",
    description: "Parabéns a todos! Nossa comunidade cresceu muito e agora somos mais de 25 mil otakus unidos!",
    engagement: "1.8k curtidas • 234 comentários",
    time: "há 3 horas",
  },
  {
    id: 3,
    type: "featured",
    title: "Fanart da Semana: Nezuko por @ArtistKawaii",
    description: "Uma obra de arte incrível criada por um de nossos membros talentosos",
    image: "/images/anime-profiles/flower-girl.jpg",
    engagement: "3.1k curtidas • 189 comentários",
    time: "há 5 horas",
  },
  {
    id: 4,
    type: "discussion",
    title: "Debate: Qual o Melhor Arco de One Piece?",
    description: "A discussão mais acalorada da semana! Marineford vs Wano - qual é o seu favorito?",
    engagement: "892 curtidas • 567 comentários",
    time: "há 8 horas",
  },
]

const topMembers = [
  {
    id: 1,
    name: "KawaiiDream",
    avatar: "/images/anime-profiles/blonde-cat-girl.jpg",
    points: 2840,
    badge: "Otaku Lendário",
  },
  {
    id: 2,
    name: "BlueEyedHero",
    avatar: "/images/anime-profiles/green-hair-girl.jpg",
    points: 2156,
    badge: "Mestre dos Animes",
  },
  {
    id: 3,
    name: "GreenGoddess",
    avatar: "/images/anime-profiles/adventure-boy.jpg",
    points: 1987,
    badge: "Crítica Expert",
  },
]

export default function Highlights({ isDarkMode }: HighlightsProps) {
  return (
    <div className="flex-1 space-y-6">
      {/* Featured Content */}
      <div
        className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-6`}
      >
        <h2
          className={`text-xl font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"} mb-6 flex items-center`}
        >
          <i className="bi bi-star-fill text-purple-500 me-2"></i>
          Destaques da Comunidade
        </h2>

        <div className="space-y-6">
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              className={`border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} rounded-lg p-4 hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start space-x-4">
                {highlight.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={highlight.image || "/placeholder.svg"}
                      alt={highlight.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {highlight.type === "trending" && <i className="bi bi-trending-up text-red-500"></i>}
                    {highlight.type === "achievement" && <i className="bi bi-award text-yellow-500"></i>}
                    {highlight.type === "featured" && <i className="bi bi-star-fill text-purple-500"></i>}
                    {highlight.type === "discussion" && <i className="bi bi-people text-blue-500"></i>}
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        highlight.type === "trending"
                          ? "bg-red-100 text-red-700"
                          : highlight.type === "achievement"
                            ? "bg-yellow-100 text-yellow-700"
                            : highlight.type === "featured"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {highlight.type === "trending" && "Em Alta"}
                      {highlight.type === "achievement" && "Conquista"}
                      {highlight.type === "featured" && "Destaque"}
                      {highlight.type === "discussion" && "Discussão"}
                    </span>
                  </div>
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
                    {highlight.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>
                    {highlight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {highlight.engagement}
                    </span>
                    <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {highlight.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  )
}
