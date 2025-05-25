"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Bell,
  Upload,
  Settings,
  Menu,
  Home,
  Compass,
  TrendingUp,
  Users,
  Star,
  Code,
  Gamepad2,
  Music,
  Palette,
  ChefHat,
  Play,
  Zap,
  Headphones,
  BookOpen,
  Film,
  BarChart3,
  MessageCircle,
  Sparkles,
} from "lucide-react"

interface HeaderProps {
  avatarImage: string
  onCreatePost: () => void
}

export function Header({ avatarImage, onCreatePost }: HeaderProps) {
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [megaMenuDescription, setMegaMenuDescription] = useState("Descubra mais conteúdo incrível na nossa plataforma")

  const megaMenuCategories = [
    {
      title: "Navegação",
      description: "Navegue pelas principais seções da plataforma",
      items: [
        { name: "Início", icon: Home, href: "#", description: "Página inicial com conteúdo personalizado" },
        { name: "Explorar", icon: Compass, href: "#", description: "Descubra novos criadores e conteúdos" },
        { name: "Trending", icon: TrendingUp, href: "#", description: "Veja o que está em alta agora" },
        { name: "Comunidade", icon: Users, href: "#", description: "Conecte-se com outros usuários" },
      ],
    },
    {
      title: "Categorias",
      description: "Explore conteúdo por categoria de interesse",
      items: [
        { name: "Anime", icon: Star, href: "#", description: "Reviews, análises e discussões sobre anime" },
        { name: "Tecnologia", icon: Code, href: "#", description: "Tutoriais e novidades do mundo tech" },
        { name: "Jogos", icon: Gamepad2, href: "#", description: "Gameplay, reviews e dicas de jogos" },
        { name: "Música", icon: Music, href: "#", description: "Covers, análises e descobertas musicais" },
        { name: "Arte", icon: Palette, href: "#", description: "Criações artísticas e tutoriais" },
        { name: "Culinária", icon: ChefHat, href: "#", description: "Receitas e técnicas culinárias" },
      ],
    },
    {
      title: "Conteúdo",
      description: "Diferentes formatos de conteúdo disponíveis",
      items: [
        { name: "Vídeos", icon: Play, href: "#", description: "Assista vídeos de alta qualidade" },
        { name: "Lives", icon: Zap, href: "#", description: "Transmissões ao vivo interativas" },
        { name: "Podcasts", icon: Headphones, href: "#", description: "Ouça conversas e discussões" },
        { name: "Artigos", icon: BookOpen, href: "#", description: "Leia conteúdo escrito detalhado" },
      ],
    },
    {
      title: "Recursos",
      description: "Ferramentas para criadores e usuários avançados",
      items: [
        { name: "Criador Studio", icon: Film, href: "#", description: "Gerencie seu conteúdo e canal" },
        { name: "Analytics", icon: BarChart3, href: "#", description: "Acompanhe suas estatísticas" },
        { name: "Monetização", icon: Sparkles, href: "#", description: "Monetize seu conteúdo" },
        { name: "Suporte", icon: MessageCircle, href: "#", description: "Obtenha ajuda e suporte" },
      ],
    },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMegaMenu(!showMegaMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </Button>

                  {/* Mega Menu */}
                  {showMegaMenu && (
                    <div className="absolute top-full left-0 mt-2 w-[800px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50">
                      <div className="p-6">
                        <div className="grid grid-cols-4 gap-8">
                          {megaMenuCategories.map((category, index) => (
                            <div key={index} className="space-y-4">
                              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                                {category.title}
                              </h3>
                              <ul className="space-y-3">
                                {category.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <a
                                      href={item.href}
                                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group"
                                      onMouseEnter={() => setMegaMenuDescription(item.description)}
                                      onMouseLeave={() =>
                                        setMegaMenuDescription("Descubra mais conteúdo incrível na nossa plataforma")
                                      }
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                        <item.icon className="w-4 h-4" />
                                      </div>
                                      <span className="text-sm font-medium">{item.name}</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 mt-6 pt-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">{megaMenuDescription}</div>
                            <Button
                              onClick={() => setShowMegaMenu(false)}
                              variant="outline"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              Fechar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">BILIBILI</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Início
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Explorar
              </Button>
              <Button variant="ghost" className="text-blue-600 font-medium">
                Perfil
              </Button>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Input
                placeholder="Buscar..."
                className="pl-4 pr-10 py-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button size="sm" className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onCreatePost}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 border"
            >
              <Upload className="w-4 h-4 mr-2" />
              Criar Post
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatarImage || "/placeholder.svg"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Overlay para fechar o mega menu */}
      {showMegaMenu && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMegaMenu(false)} />}
    </header>
  )
}
