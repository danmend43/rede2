interface Community {
  id: number
  name: string
  avatar: string
  coverImage: string
  members: number
  online: number
  description: string
}

interface Event {
  id: number
  title: string
  date: string
  status: "ativo" | "em_breve" | "encerrado"
}

interface Poll {
  id: number
  question: string
  options: {
    name: string
    percentage: number
  }[]
}

interface OverviewProps {
  currentCommunity: Community
  isDarkMode: boolean
}

const events: Event[] = [
  {
    id: 1,
    title: "Concurso de Fanart",
    date: "Termina em 5 dias",
    status: "ativo",
  },
  {
    id: 2,
    title: "Maratona Anime",
    date: "20-22 Jan",
    status: "em_breve",
  },
]

const poll: Poll = {
  id: 1,
  question: "Melhor anime da temporada?",
  options: [
    {
      name: "Jujutsu Kaisen",
      percentage: 45,
    },
    {
      name: "Demon Slayer",
      percentage: 30,
    },
    {
      name: "My Hero Academia",
      percentage: 15,
    },
    {
      name: "Outro",
      percentage: 10,
    },
  ],
}

export default function Overview({ currentCommunity, isDarkMode }: OverviewProps) {
  return (
    <div className="flex-1">
      

      <div className="grid grid-cols-2 gap-6">
        <div
          className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-6`}
        >
          <h2
            className={`text-xl font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 flex items-center`}
          >
            <i className="bi bi-calendar-event text-purple-500 me-2"></i>
            Eventos
          </h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`border ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} rounded-lg p-4 hover:shadow-sm transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{event.title}</h3>
                  {event.status === "ativo" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Ativo
                    </span>
                  )}
                  {event.status === "em_breve" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Em breve
                    </span>
                  )}
                </div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-1 flex items-center`}>
                  <i className="bi bi-clock text-gray-400 me-1"></i>
                  {event.date}
                </p>
              </div>
            ))}
          </div>
          <button
            className={`w-full mt-4 text-purple-500 text-sm font-medium hover:text-purple-600 flex items-center justify-center`}
          >
            Ver todos os eventos
          </button>
        </div>

        <div
          className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-xl border p-6`}
        >
          <h2
            className={`text-xl font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 flex items-center`}
          >
            <i className="bi bi-bar-chart text-purple-500 me-2"></i>
            Enquetes
          </h2>
          <div>
            <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-3`}>{poll.question}</h3>
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{option.name}</span>
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700 font-medium"}>
                      {option.percentage}%
                    </span>
                  </div>
                  <div className={`w-full ${isDarkMode ? "bg-[#27272a]" : "bg-gray-200"} rounded-full h-2`}>
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${option.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={`w-full mt-4 ${isDarkMode ? "bg-[#27272a] hover:bg-[#3f3f46] text-white" : "bg-gray-900 hover:bg-black text-white"} font-medium py-2 px-4 rounded-lg transition-colors`}
            >
              Votar
            </button>
            <button className="w-full mt-3 text-purple-500 text-sm font-medium hover:text-purple-600 flex items-center justify-center">
              Ver todas as enquetes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
