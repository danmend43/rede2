"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  LinkIcon,
  MoreHorizontal,
  Edit3,
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Play,
  Star,
  Camera,
  Trophy,
  Zap,
  Flame,
  Award,
  Shield,
  Medal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EditProfileModal } from "@/components/edit-profile-modal"

type TabType = "overview" | "posts" | "replies" | "media" | "likes"

export default function ProfilePage() {
  const [primaryColor, setPrimaryColor] = useState("#1d9bf0")
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [profileData, setProfileData] = useState({
    name: "Dan mend",
    bio: "🚀 Desenvolvedor Back-end com Go | Experiência em aplicações web com Next.js, React e TypeScript",
    location: "São Paulo, Brasil",
    website: "dan-dev.com",
    profileImage: "/images/new-default-avatar.png",
    coverImage: "",
    coverGradient: "#9CA3AF",
  })
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--primary-color") || "#1d9bf0"
      setPrimaryColor(color)
    }

    updateColor()

    const observer = new MutationObserver(updateColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing)
  }

  const getLevelColor = (level: number) => {
    if (level >= 90) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    if (level >= 70) return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
    if (level >= 50) return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
    if (level >= 30) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    if (level >= 10) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  }

  const badges = [
    {
      id: 1,
      name: "Membro Pro",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "bg-gradient-to-r from-yellow-500 to-amber-500",
      earned: true,
    },
    {
      id: 2,
      name: "Membro Beta",
      icon: <Zap className="w-4 h-4" />,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      earned: true,
    },
    {
      id: 3,
      name: "Membro Fundador",
      icon: <Trophy className="w-4 h-4" />,
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      earned: true,
    },
  ]

  const userStats = {
    level: 25,
    xp: 2450,
    nextLevel: 3000,
    progress: 82,
    rank: "Desenvolvedor Sênior",
    reputation: 4850,
    contributions: 187,
    streak: 14,
    totalAchievements: 17,
    totalPossibleAchievements: 45,
    weeklyXp: 340,
    monthlyRank: 127,
    globalRank: 1247,
  }

  const weeklyStats = [
    { day: "Seg", xp: 45 },
    { day: "Ter", xp: 67 },
    { day: "Qua", xp: 23 },
    { day: "Qui", xp: 89 },
    { day: "Sex", xp: 56 },
    { day: "Sáb", xp: 34 },
    { day: "Dom", xp: 26 },
  ]

  const maxWeeklyXp = Math.max(...weeklyStats.map((s) => s.xp))

  const userPosts = [
    {
      id: 1,
      content:
        "Acabei de finalizar um projeto incrível! 🚀 Foram semanas de muito trabalho, mas o resultado ficou melhor do que eu esperava. Obrigado a todos que me apoiaram durante essa jornada!",
      time: "2h",
      likes: 89,
      comments: 23,
      shares: 12,
      image: "https://i.pinimg.com/736x/66/8e/c4/668ec41e3a80bfaff5694c172374c462.jpg",
    },
    {
      id: 2,
      content:
        "Dica do dia: sempre mantenham a curiosidade viva! 💡 A tecnologia evolui muito rápido e quem para de aprender fica para trás. Qual foi a última coisa nova que vocês aprenderam?",
      time: "1d",
      likes: 156,
      comments: 45,
      shares: 28,
    },
    {
      id: 3,
      content:
        "Bom dia pessoal! ☀️ Começando mais um dia com muita energia e disposição. Hoje o foco é terminar aquela feature que estava desenvolvendo. Como vocês estão começando o dia?",
      time: "2d",
      likes: 67,
      comments: 18,
      shares: 5,
    },
  ]

  const mediaItems = [
    {
      id: 1,
      type: "image",
      url: "https://i.pinimg.com/736x/66/8e/c4/668ec41e3a80bfaff5694c172374c462.jpg",
    },
    {
      id: 2,
      type: "image",
      url: "https://i.pinimg.com/1200x/18/86/7c/18867cb31f36820b8908b1f462ab8b70.jpg",
    },
    {
      id: 3,
      type: "video",
      url: "https://i.pinimg.com/originals/a6/95/24/a69524a7eadd4156fef3a9eb78d24375.gif",
    },
    {
      id: 4,
      type: "image",
      url: "https://i.pinimg.com/736x/09/70/08/097008f7be427688c1589d7fb4d8e1e5.jpg",
    },
    {
      id: 5,
      type: "image",
      url: "https://i.pinimg.com/1200x/de/5a/0a/de5a0a7bb19d0092e921d37eaafbfc28.jpg",
    },
    {
      id: 6,
      type: "image",
      url: "https://i.pinimg.com/736x/e6/50/de/e650dee5fcf29a28e9aea5b0ea26d5eb.jpg",
    },
  ]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "posts", label: "Posts" },
    { id: "replies", label: "Respostas" },
    { id: "media", label: "Mídia" },
    { id: "likes", label: "Curtidas" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-2xl">
              <div
                className="p-6 relative overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25, ${primaryColor}10)`,
                  border: "none",
                }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 20% 50%, ${primaryColor}20 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${primaryColor}15 0%, transparent 50%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nível {userStats.level}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{userStats.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {userStats.xp.toLocaleString()} / {userStats.nextLevel.toLocaleString()} XP
                      </p>
                      <p className="text-lg font-bold" style={{ color: primaryColor }}>
                        {userStats.progress}% completo
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={userStats.progress}
                    className="h-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-2xl">
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Estatísticas</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.reputation.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reputação</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.contributions}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Contribuições</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.streak}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dias seguidos</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.totalAchievements}/{userStats.totalPossibleAchievements}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Conquistas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: primaryColor }} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Badges</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                      {badges.filter((b) => b.earned).length}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {badges
                    .filter((badge) => badge.earned)
                    .map((badge) => (
                      <div key={badge.id} className="group relative">
                        <div
                          className={`${badge.color} px-4 py-2 rounded-full flex items-center gap-2 text-white group-hover:scale-105 transition-all duration-300`}
                        >
                          {React.cloneElement(badge.icon, { className: "w-4 h-4 text-white" })}
                          <span className="text-sm font-bold text-white">{badge.name}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5" style={{ color: primaryColor }} />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rankings & Atividade</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-100 dark:border-yellow-900/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Ranking Global</h4> 
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">#{userStats.globalRank}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Posição atual</p>
                      </div> 
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Sequência</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Continue assim!</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{userStats.streak}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">dias seguidos</p>
                      </div> 
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Atividade Semanal</h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total: {userStats.weeklyXp} XP</p>
                  </div>

                  <div className="flex items-end justify-between gap-2 h-16">
                    {weeklyStats.map((stat, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className="w-full rounded-t-lg transition-all hover:opacity-80"
                          style={{
                            height: `${(stat.xp / maxWeeklyXp) * 48}px`,
                            backgroundColor: stat.xp === maxWeeklyXp ? primaryColor : `${primaryColor}80`,
                            minHeight: "4px",
                          }}
                        />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "posts":
        return (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <Card
                key={post.id}
                className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-3xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: primaryColor }}>
                          AT
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 dark:text-white">Dan mend</p>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(25)}`}>
                            Lv.25
                          </span>
                          <p className="text-gray-500 pl-5 dark:text-gray-400">{post.time}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">@dan_dev</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">{post.content}</p>
                  {post.image && (
                    <div className="rounded-2xl overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post image"
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t border-gray-100 dark:border-gray-900 px-6 py-4">
                  <div className="flex w-full justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-500 dark:text-gray-400 rounded-full"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor
                        e.currentTarget.style.backgroundColor = `${primaryColor}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = ""
                        e.currentTarget.style.backgroundColor = ""
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.comments}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-full"
                    >
                      <Repeat2 className="h-4 w-4" />
                      <span className="font-medium">{post.shares}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 dark:text-gray-400 rounded-full"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor
                        e.currentTarget.style.backgroundColor = `${primaryColor}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = ""
                        e.currentTarget.style.backgroundColor = ""
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )

      case "media":
        return (
          <div className="grid grid-cols-3 gap-1">
            {mediaItems.map((item) => (
              <div key={item.id} className="aspect-square relative group cursor-pointer">
                <img
                  src={item.url || "/placeholder.svg"}
                  alt="Media"
                  className="w-full h-full object-cover rounded-lg"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg">
                    <Play className="w-8 h-8 text-white" fill="white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
              </div>
            ))}
          </div>
        )

      case "replies":
        return (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma resposta ainda</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Quando você responder a outros posts, eles aparecerão aqui.
            </p>
          </div>
        )

      case "likes":
        return (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma curtida ainda</h3>
            <p className="text-gray-600 dark:text-gray-400">Quando você curtir posts, eles aparecerão aqui.</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl overflow-hidden">
        <div
          className="h-56 relative overflow-hidden"
          style={{
            backgroundImage: profileData.coverImage ? `url(${profileData.coverImage})` : undefined,
            backgroundColor: !profileData.coverImage ? profileData.coverGradient : undefined,
            backgroundSize: profileData.coverImage ? "cover" : undefined,
            backgroundPosition: profileData.coverImage ? "center" : undefined,
            borderRadius: "1.5rem",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 rounded-full backdrop-blur-sm border border-white/20"
          >
            <Camera className="h-4 w-4 text-white" />
          </Button>
        </div>

        <div className="p-6 -mt-20 relative">
          <div className="flex items-end justify-between mb-4">
            <div className="relative h-32 w-32">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"
                style={{ animationDuration: "3s" }}
              ></div>

              <div className="absolute inset-1 rounded-full bg-white dark:bg-black"></div>

              <div className="absolute inset-2 rounded-full overflow-hidden">
                <img
                  src={profileData.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-20">
              <Button
                onClick={handleFollowClick}
                className={`px-6 py-2 font-semibold rounded-full transition-all ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-red-50 hover:text-red-600"
                    : "text-white"
                }`}
                style={!isFollowing ? { backgroundColor: primaryColor } : {}}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </Button>

              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                className="px-6 py-2 font-semibold rounded-full border-gray-100 dark:border-gray-900 bg-white dark:bg-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.name}</h1>
                <img src="/images/verificar.png" alt="Verificado" className="w-6 h-6" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">@dan_dev</p>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profileData.bio}</p>

            <div className="flex gap-6 py-3">
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 dark:text-white">1.2K</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Seguindo</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 dark:text-white">12.5K</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Seguidores</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 dark:text-white">4.8K</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Curtidas</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href={`https://${profileData.website}`} className="hover:underline" style={{ color: primaryColor }}>
                  {profileData.website}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Ingressou em março de 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border border-gray-200 dark:border-gray-900 bg-white dark:bg-black rounded-3xl">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                activeTab === tab.id
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      {renderTabContent()}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(data) => {
          setProfileData(data)
          // Dispatch event to update profile image in TopNav
          const event = new CustomEvent("profileUpdated", {
            detail: { profileImage: data.profileImage },
          })
          window.dispatchEvent(event)
        }}
        initialData={{
          name: profileData.name,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          profileImage: profileData.profileImage,
          coverImage: profileData.coverImage,
          coverGradient: profileData.coverGradient,
        }}
      />
    </div>
  )
}
