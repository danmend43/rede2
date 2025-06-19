"use client"
import { useState, useEffect } from "react"
import VerificationBadge from "@/app/home/components/verification-badge"

interface FeedProps {
  isDarkMode: boolean
}

const feedPosts = [
  {
    id: 1,
    user: "KawaiiDream",
    avatar: "/images/anime-profiles/blonde-cat-girl.jpg",
    time: "há 2 horas",
    content:
      "Acabei de assistir o último episódio de Demon Slayer e estou sem palavras! A animação estava perfeita 🔥✨ O estúdio Ufotable realmente superou todas as expectativas com essa temporada.",
    image: "/images/anime-profiles/cozy-girl.jpg",
    likes: 156,
    comments: 34,
    shares: 28,
    community: "Anime Café",
    communityAvatar: "/images/anime-profiles/cozy-girl.jpg",
    communityTag: "CAFÉ",
    isLiked: false,
    isBookmarked: true,
    userLevel: 31,
    tags: ["DemonSlayer", "Anime", "Ufotable"],
    verificationBadge: "blue" as const,
  },
  {
    id: 2,
    user: "BlueEyedHero",
    avatar: "/images/anime-profiles/green-hair-girl.jpg",
    time: "há 4 horas",
    content:
      "Alguém mais está ansioso para o próximo capítulo de Chainsaw Man? As teorias estão ficando cada vez mais interessantes! 📖 Fujimoto sempre consegue nos surpreender.",
    likes: 89,
    comments: 23,
    shares: 12,
    community: "Manga Lovers",
    communityAvatar: "/images/anime-profiles/green-hair-girl.jpg",
    communityTag: "MANGA",
    isLiked: true,
    isBookmarked: false,
    userLevel: 18,
    tags: ["ChainsawMan", "Manga", "Fujimoto"],
    verificationBadge: "green" as const,
  },
  {
    id: 3,
    user: "GreenGoddess",
    avatar: "/images/anime-profiles/adventure-boy.jpg",
    time: "há 6 horas",
    content:
      "Terminei de assistir Jujutsu Kaisen e agora estou com aquela sensação de vazio pós-anime 😭 Alguém tem recomendações similares? Preciso de algo para preencher esse buraco no coração!",
    likes: 234,
    comments: 67,
    shares: 45,
    community: "Jujutsu Kaisen BR",
    communityAvatar: "/images/anime-profiles/adventure-boy.jpg",
    communityTag: "JJK",
    isLiked: false,
    isBookmarked: true,
    userLevel: 42,
    tags: ["JujutsuKaisen", "Anime", "Recomendações"],
    verificationBadge: "blue" as const,
  },
  {
    id: 4,
    user: "MagicalStar",
    avatar: "/images/anime-profiles/pink-hair-cats.jpg",
    time: "há 8 horas",
    content:
      "Sailor Moon sempre será meu anime favorito! Quem mais cresceu assistindo essa obra-prima? 🌙✨ A nostalgia bate forte sempre que escuto o opening.",
    image: "/images/anime-profiles/flower-girl.jpg",
    likes: 445,
    comments: 89,
    shares: 67,
    community: "Sailor Moon Fans",
    communityAvatar: "/images/anime-profiles/pink-hair-cats.jpg",
    communityTag: "SAILOR",
    isLiked: true,
    isBookmarked: true,
    userLevel: 25,
    tags: ["SailorMoon", "Nostalgia", "Anime"],
    verificationBadge: "yellow" as const,
  },
]

export default function Feed({ isDarkMode }: FeedProps) {
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState(feedPosts)
  const [profileImage, setProfileImage] = useState("/images/new-profile.jpg")

  useEffect(() => {
    // Carregar foto salva
    const savedImage = localStorage.getItem("profileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: Date.now(),
        user: "Dan",
        avatar: profileImage,
        time: "agora",
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        userLevel: 5,
        communityTag: "CAFÉ",
        verificationBadge: "blue" as const,
        community: "Anime Café",
        communityAvatar: "/images/anime-profiles/cozy-girl.jpg",
      }
      setPosts([newPostObj, ...posts])
      setNewPost("")
    }
  }

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
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

  return (
    <div className="flex-1 space-y-6">
      {/* Create Post */}
      <div
        className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border shadow-sm overflow-hidden p-4`}
      >
        <div className="flex items-start space-x-3 mb-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            {/* Foto do perfil */}
            <div
              className={`w-full h-full rounded-full overflow-hidden border-2 ${isDarkMode ? "border-[#27272a] bg-[#0B0B0D]" : "border-gray-200 bg-gray-50"}`}
            >
              <img src={profileImage || "/placeholder.svg"} alt="Perfil" className="w-full h-full object-cover" />
            </div>

            {/* Indicador de progresso circular */}
            {newPost.length > 0 && (
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Círculo de fundo */}
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke={isDarkMode ? "#27272a" : "#e5e7eb"}
                  strokeWidth="4"
                />
                {/* Círculo de progresso */}
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke={newPost.length >= 480 ? "#ef4444" : newPost.length >= 450 ? "#f59e0b" : "#00AEEC"}
                  strokeWidth="4"
                  strokeDasharray={`${(newPost.length / 500) * 301.59} 301.59`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Compartilhe algo com a comunidade..."
              value={newPost}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setNewPost(e.target.value)
                }
              }}
              rows={3}
              className={`w-full px-0 py-2 border-0 resize-none bg-transparent ${isDarkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"} focus:outline-none text-base break-words overflow-wrap-anywhere`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
            className="text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#00AEEC" }}
          >
            Postar
          </button>

          <div className="flex items-center space-x-3">
            <button
              className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-lg transition-colors`}
            >
              <i className={`bi bi-plus-lg text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}></i>
            </button>
            <button
              className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-lg transition-colors`}
            >
              <i className={`bi bi-image text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}></i>
            </button>
            <button
              className={`p-2 ${isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-100"} rounded-lg transition-colors`}
            >
              <i className={`bi bi-camera-video text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow duration-200`}
          >
            {/* Header com avatar, nome e level na mesma linha */}
            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`w-14 h-14 rounded-full p-0.5 flex-shrink-0 ${isDarkMode ? "border border-[#27272a]" : "border border-gray-300"}`}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src={post.avatar || "/placeholder.svg"} alt={post.user} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-semibold text-[15px] ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {post.user}
                    </h4>
                    <VerificationBadge type={post.verificationBadge} />
                    {post.userLevel && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-bold text-white ${
                          post.userLevel >= 40
                            ? "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
                            : post.userLevel >= 30
                              ? "bg-gradient-to-r from-purple-400 to-purple-600"
                              : post.userLevel >= 20
                                ? "bg-gradient-to-r from-green-400 to-green-600"
                                : post.userLevel >= 10
                                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                  : "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black"
                        }`}
                      >
                        Lv {post.userLevel}
                      </span>
                    )}
                    <span className={`text-[13px] font-normal ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {post.time}
                    </span>
                  </div>
                  <span className={`text-[12px] font-normal ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                    @{post.user.toLowerCase().replace(/\s+/g, "")}
                  </span>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <p
              className={`${isDarkMode ? "text-gray-300" : "text-gray-800"} text-[15px] leading-[1.3] mb-4 font-normal break-words overflow-wrap-anywhere`}
            >
              {post.content}
            </p>

            {/* Imagem */}
            {post.image && (
              <div className="mb-5 rounded-2xl overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post content"
                  className="w-full object-cover max-h-80 rounded-2xl"
                />
              </div>
            )}

            {/* Stats na parte inferior - horizontal */}
            <div
              className={`flex items-center space-x-8 pt-3 border-t ${isDarkMode ? "border-[#27272a]" : "border-gray-100"}`}
            >
              <button
                className={`flex items-center space-x-2 text-[13px] py-2 font-normal ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
              >
                <i className="bi bi-chat text-base"></i>
                <span>{post.comments}</span>
              </button>

              <button
                className={`flex items-center space-x-2 text-[13px] py-2 font-normal ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
              >
                <i className="bi bi-arrow-repeat text-base"></i>
                <span>{post.shares}</span>
              </button>

              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-2 text-[13px] py-2 font-normal ${
                  post.isLiked
                    ? "text-[#00AEEC]"
                    : isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <i className={`bi bi-heart${post.isLiked ? "-fill" : ""} text-base`}></i>
                <span>{post.likes}</span>
              </button>

              <button
                className={`flex items-center space-x-2 text-sm py-2 font-medium ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
              >
                <i className="bi bi-share text-base"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
