"use client"
import { useState } from "react"
import Link from "next/link"
import type { Community } from "@/app/home/types"

interface SidebarProps {
  isDarkMode: boolean
  communities?: Community[]
  currentPage?: string
}

export default function Sidebar({ isDarkMode, communities = [], currentPage = "home" }: SidebarProps) {
  const [isCommunitiesMenuOpen, setIsCommunitiesMenuOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)

  const closeAllMenus = () => {
    setIsCommunitiesMenuOpen(false)
    setIsSettingsMenuOpen(false)
  }

  const switchCommunity = (community: Community) => {
    setIsCommunitiesMenuOpen(false)
    // Usar router.push ao invés de window.location para navegação mais rápida
    window.location.href = `/community/${community.id}`
  }

  return (
    <>
      {/* Left Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[76px] ${
          isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"
        } border-r flex flex-col items-center py-4 z-50`}
      >
        <div className="mb-8">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center">
              <img
                src="/images/logobilibili-white.png"
                alt="Bilibili"
                className="w-8 h-8"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(175deg) brightness(119%) contrast(119%)",
                }}
              />
            </button>
          </Link>
        </div>

        <div className="flex flex-col space-y-8 flex-1">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center relative">
              <i
                className={`bi ${currentPage === "home" ? "bi-house-door-fill" : "bi-house-door"} text-2xl ${
                  currentPage === "home"
                    ? isDarkMode
                      ? "text-white"
                      : "text-gray-900"
                    : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-900"
                }`}
              ></i>
            </button>
          </Link>

          <button className="w-10 h-10 flex items-center justify-center">
            <i className={`bi-compass text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}></i>
          </button>

          <button
            className="w-10 h-10 flex items-center justify-center relative"
            onClick={() => {
              closeAllMenus()
              setIsCommunitiesMenuOpen(!isCommunitiesMenuOpen)
            }}
          >
            <i
              className={`bi ${isCommunitiesMenuOpen ? "bi-people-fill" : "bi-people"} text-2xl ${
                isDarkMode ? "text-gray-400" : "text-gray-900"
              }`}
            ></i>
          </button>

          <button className="w-10 h-10 flex items-center justify-center">
            <i className={`bi bi-plus-lg text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}></i>
          </button>

          <button className="w-10 h-10 flex items-center justify-center">
            <i className={`bi bi-chat-square text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}></i>
          </button>

          <button className="w-10 h-10 flex items-center justify-center">
            <i className={`bi bi-bell text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}></i>
          </button>
        </div>

        <div className="mt-auto mb-6 flex flex-col items-center space-y-6">
          <button
            className="w-10 h-10 flex items-center justify-center relative"
            onClick={() => {
              closeAllMenus()
              setIsSettingsMenuOpen(!isSettingsMenuOpen)
            }}
          >
            <i
              className={`bi ${isSettingsMenuOpen || currentPage === "settings" ? "bi-gear-fill" : "bi-gear"} text-2xl ${
                isDarkMode ? "text-gray-400" : "text-gray-900"
              }`}
            ></i>
          </button>
        </div>
      </div>

      {/* Menu de Configurações */}
      {isSettingsMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
          <div
            className={`fixed left-[76px] top-0 h-full w-80 ${
              isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"
            } border-r z-50 shadow-lg overflow-y-auto`}
          >
            <div className={`p-4 border-b ${isDarkMode ? "border-[#27272a]" : "border-gray-200"} relative`}>
              <h2 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Menu
              </h2>
              <button
                onClick={() => setIsSettingsMenuOpen(false)}
                className={`p-2 ${
                  isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"
                } rounded-full absolute top-2 right-2 transition-colors`}
              >
                <i className={`bi bi-x text-xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}></i>
              </button>
            </div>

            <div className="p-4 space-y-1">
              {/* Seção Conta */}
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 px-2`}>
                  Conta
                </h3>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Adicionar conta da comunidade
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Trocar de conta
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Sair
                  </button>
                  <Link href="/settings">
                    <button
                      className={`w-full text-left px-3 py-2.5 rounded-lg ${
                        currentPage === "settings"
                          ? isDarkMode
                            ? "bg-[#27272a] text-white"
                            : "bg-gray-100 text-gray-900"
                          : isDarkMode
                            ? "hover:bg-[#27272a] text-gray-300"
                            : "hover:bg-gray-50 text-gray-700"
                      } transition-colors text-sm font-medium`}
                    >
                      Configurações
                    </button>
                  </Link>
                </div>
              </div>

              {/* Seção Suporte */}
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 px-2`}>
                  Suporte e Segurança
                </h3>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Central de Denúncias e Violações
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Seus direitos de privacidade
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Central de Ajuda</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Termos de Serviço</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Política de Privacidade</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm flex items-center justify-between`}
                  >
                    <span>Política de Cookies</span>
                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Seção Sobre */}
              <div className="mb-4">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 px-2`}>
                  Sobre
                </h3>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Sobre a plataforma
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg ${
                      isDarkMode ? "hover:bg-[#27272a] text-gray-300" : "hover:bg-gray-50 text-gray-700"
                    } transition-colors text-sm`}
                  >
                    Novidades e atualizações
                  </button>
                </div>
              </div>

              {/* Links de Política */}
              <div className={`pt-4 border-t ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}>
                <div className="text-center">
                  <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>© 2025 coronocorp</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu de Comunidades */}
      {isCommunitiesMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsCommunitiesMenuOpen(false)}></div>
          <div
            className={`fixed left-[76px] top-0 h-full w-80 ${
              isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"
            } border-r z-50 shadow-lg overflow-y-auto`}
          >
            <div className={`p-4 border-b ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}>
              <h2 className={`text-lg font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Suas Comunidades
              </h2>
              <button
                onClick={() => setIsCommunitiesMenuOpen(false)}
                className={`p-1 ${
                  isDarkMode ? "hover:bg-[#27272a]" : "hover:bg-gray-50"
                } rounded-full absolute top-4 right-4`}
              >
                <i className={`bi bi-x text-xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}></i>
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <i className="bi-compass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Pesquisar comunidades..."
                  className={`w-full pl-10 pr-4 py-2 border ${
                    isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm`}
                />
              </div>

              <div className="space-y-3">
                {communities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => switchCommunity(community)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isDarkMode
                        ? "border border-[#27272a] hover:bg-[#27272a]"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={community.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={community.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} truncate text-sm`}>
                        {community.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{community.members.toLocaleString()} membros</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{community.online} online</span>
                      </div>
                    </div>

                    <i className={`bi bi-chevron-right text-sm ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}></i>
                  </button>
                ))}
              </div>

              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Explorar Mais Comunidades
              </button>
            </div>
          </div>
        </>
      )}

      {(isCommunitiesMenuOpen || isSettingsMenuOpen) && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={closeAllMenus}></div>
      )}
    </>
  )
}
