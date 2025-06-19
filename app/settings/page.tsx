"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Sidebar from "@/app/shared/components/sidebar"
import SearchBar from "@/app/shared/components/search-bar"
import { communities } from "@/app/home/data/mock-data"

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState("account")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [profileImage, setProfileImage] = useState("/images/new-profile.jpg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [formData, setFormData] = useState({
    username: "Dan",
    displayName: "Dan",
    bio: "",
    email: "dan@example.com",
    phone: "",
    profilePublic: true,
    showOnlineStatus: true,
    allowMessagesFromAnyone: false,
    pushNotifications: {
      likes: true,
      comments: true,
      followers: true,
      messages: true,
    },
    emailNotifications: {
      weeklyDigest: true,
      platformNews: false,
    },
    fontSize: "md",
    reduceAnimations: false,
    language: "pt-BR",
    autoSave: true,
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }

    // Carregar foto salva
    const savedImage = localStorage.getItem("profileImage")
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    setHasUnsavedChanges(true)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)
  }

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
    setHasUnsavedChanges(true)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = e.target?.result as string
        setProfileImage(newImage)
        setHasUnsavedChanges(true)

        // Salvar imediatamente no localStorage e disparar evento
        localStorage.setItem("profileImage", newImage)
        window.dispatchEvent(
          new CustomEvent("profileImageChanged", {
            detail: { newImage },
          }),
        )
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangePSeguindoo = () => {
    fileInputRef.current?.click()
  }

  const handleRemovePSeguindoo = () => {
    const defaultImage = "/images/new-profile.jpg"
    setProfileImage(defaultImage)
    setHasUnsavedChanges(true)

    // Salvar imediatamente no localStorage e disparar evento
    localStorage.setItem("profileImage", defaultImage)
    window.dispatchEvent(
      new CustomEvent("profileImageChanged", {
        detail: { newImage: defaultImage },
      }),
    )
  }

  const saveSettings = async () => {
    setIsSaving(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Salvar no localStorage
    localStorage.setItem("userSettings", JSON.stringify(formData))
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")

    setIsSaving(false)
    setHasUnsavedChanges(false)
    setSaveSuccess(true)

    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const settingsSections = [
    { id: "account", label: "Conta", icon: "bi-person-circle", description: "Perfil e informações pessoais" },
    { id: "privacy", label: "Privacidade", icon: "bi-shield-lock", description: "Controle de privacidade" },
    { id: "notifications", label: "Notificações", icon: "bi-bell", description: "Preferências de notificação" },
    { id: "appearance", label: "Aparência", icon: "bi-palette", description: "Tema e personalização" },
    {
      id: "accessibility",
      label: "Acessibilidade",
      icon: "bi-universal-access",
      description: "Opções de acessibilidade",
    },
    { id: "language", label: "Idioma", icon: "bi-translate", description: "Idioma e região" },
    { id: "data", label: "Dados", icon: "bi-database", description: "Gerenciar seus dados" },
    { id: "help", label: "Ajuda", icon: "bi-question-circle", description: "Suporte e documentação" },
  ]

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#0B0B0D] text-white" : "bg-gray-50 text-gray-900"} flex font-sans`}
    >
      {/* Left Sidebar */}
      <Sidebar isDarkMode={isDarkMode} communities={communities} currentPage="settings" />

      {/* Main Content */}
      <div className="flex-1 ml-[76px]">
        {/* Search Bar */}
        <SearchBar isDarkMode={isDarkMode} placeholder="Pesquisar configurações..." />

        {/* Main Content Area */}
        <div className="flex mt-[82px]">
          {/* Settings Navigation - Left Column */}
          <div className="w-[320px] fixed left-[76px] top-[82px] bottom-0 h-[calc(100vh-82px)] p-4 pt-4">
            <div
              className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} p-4 h-full rounded-2xl border shadow-sm overflow-y-auto`}
            >
              <div className="mb-6">
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
                  Configurações
                </h2>
                <p className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                  Gerencie suas preferências e configurações da conta
                </p>
              </div>

              <nav className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                      activeSection === section.id
                        ? isDarkMode
                          ? "bg-[#21262d] border border-[#30363d] shadow-sm"
                          : "bg-blue-50 border border-blue-200 shadow-sm"
                        : isDarkMode
                          ? "hover:bg-[#21262d] border border-transparent"
                          : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? "bg-[#00AEEC] text-white"
                            : isDarkMode
                              ? "bg-[#30363d] text-[#7d8590] group-hover:bg-[#00AEEC] group-hover:text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-[#00AEEC] group-hover:text-white"
                        }`}
                      >
                        <i className={`${section.icon} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-sm ${
                            activeSection === section.id
                              ? isDarkMode
                                ? "text-white"
                                : "text-blue-900"
                              : isDarkMode
                                ? "text-[#e6edf3]"
                                : "text-gray-900"
                          }`}
                        >
                          {section.label}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            activeSection === section.id
                              ? isDarkMode
                                ? "text-[#7d8590]"
                                : "text-blue-700"
                              : isDarkMode
                                ? "text-[#7d8590]"
                                : "text-gray-600"
                          }`}
                        >
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content - Right Column */}
          <div className="flex-1 ml-[320px] p-4 pt-4">
            <div
              className={`${isDarkMode ? "bg-[#09090b] border-[#27272a]" : "bg-white border-gray-200"} rounded-2xl border shadow-sm min-h-[calc(100vh-120px)]`}
            >
              {/* Header with Save Button */}
              <div
                className={`flex items-center justify-between p-6 border-b ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}
              >
                <div>
                  <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {settingsSections.find((s) => s.id === activeSection)?.label}
                  </h1>
                  <p className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"} mt-1`}>
                    {settingsSections.find((s) => s.id === activeSection)?.description}
                  </p>
                </div>

                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-3">
                    {saveSuccess && (
                      <div className="flex items-center space-x-2 text-green-600 text-sm font-medium">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Salvo!</span>
                      </div>
                    )}
                    <button
                      onClick={saveSettings}
                      disabled={isSaving}
                      className="bg-[#00AEEC] hover:bg-[#0099CC] disabled:opacity-50 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg"></i>
                          <span>Salvar alterações</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Settings Content */}
              <div className="p-6">
                {/* Account Settings */}
                {activeSection === "account" && (
                  <div className="space-y-8">
                    {/* Profile Picture */}
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Foto do perfil
                      </h3>
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div
                            className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}
                          >
                            <img
                              src={profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex space-x-3">
                            <button
                              onClick={handleChangePSeguindoo}
                              className="bg-[#00AEEC] hover:bg-[#0099CC] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Alterar foto
                            </button>
                            <button
                              onClick={handleRemovePSeguindoo}
                              className={`${isDarkMode ? "bg-[#27272a] hover:bg-[#3a3a3a] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg font-medium transition-colors`}
                            >
                              Remover
                            </button>
                          </div>
                          <p className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            JPG, PNG ou GIF. Máximo 5MB.
                          </p>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {/* Basic Information */}
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Informações básicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-700"} mb-2`}
                          >
                            Nome de usuário
                          </label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            className={`w-full px-4 py-3 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-700"} mb-2`}
                          >
                            Nome de exibição
                          </label>
                          <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            className={`w-full px-4 py-3 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label
                            className={`block text-sm font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-700"} mb-2`}
                          >
                            Bio
                          </label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent resize-none`}
                            placeholder="Conte um pouco sobre você..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Informações de contato
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-700"} mb-2`}
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`w-full px-4 py-3 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-700"} mb-2`}
                          >
                            Telefone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`w-full px-4 py-3 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent`}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === "privacy" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Visibilidade do perfil
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                              Perfil público
                            </div>
                            <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                              Permitir que outros usuários vejam seu perfil
                            </div>
                          </div>
                          <button
                            onClick={() => handleInputChange("profilePublic", !formData.profilePublic)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.profilePublic ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.profilePublic ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                              Mostrar status online
                            </div>
                            <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                              Outros usuários podem ver quando você está online
                            </div>
                          </div>
                          <button
                            onClick={() => handleInputChange("showOnlineStatus", !formData.showOnlineStatus)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.showOnlineStatus ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.showOnlineStatus ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                              Mensagens de qualquer pessoa
                            </div>
                            <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                              Permitir mensagens de usuários que você não segue
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleInputChange("allowMessagesFromAnyone", !formData.allowMessagesFromAnyone)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.allowMessagesFromAnyone ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.allowMessagesFromAnyone ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === "notifications" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Notificações push
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(formData.pushNotifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                                {key === "likes"
                                  ? "Curtidas"
                                  : key === "comments"
                                    ? "Comentários"
                                    : key === "followers"
                                      ? "Novos seguidores"
                                      : "Mensagens"}
                              </div>
                              <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                                Receber notificações sobre{" "}
                                {key === "likes"
                                  ? "curtidas nos seus posts"
                                  : key === "comments"
                                    ? "comentários nos seus posts"
                                    : key === "followers"
                                      ? "novos seguidores"
                                      : "mensagens diretas"}
                              </div>
                            </div>
                            <button
                              onClick={() => handleNestedChange("pushNotifications", key, !value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Notificações por email
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(formData.emailNotifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                                {key === "weeklyDigest" ? "Resumo semanal" : "Novidades da plataforma"}
                              </div>
                              <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                                {key === "weeklyDigest"
                                  ? "Receber um resumo semanal das suas atividades"
                                  : "Receber emails sobre atualizações e novidades"}
                              </div>
                            </div>
                            <button
                              onClick={() => handleNestedChange("emailNotifications", key, !value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeSection === "appearance" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Tema
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setIsDarkMode(false)
                            localStorage.setItem("theme", "light")
                            setHasUnsavedChanges(true)
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${!isDarkMode ? "border-[#00AEEC] bg-blue-50" : isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"}`}
                        >
                          <div className="w-full h-20 bg-white border border-gray-200 rounded-lg mb-3 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-100 rounded"></div>
                          </div>
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Claro</div>
                        </button>

                        <button
                          onClick={() => {
                            setIsDarkMode(true)
                            localStorage.setItem("theme", "dark")
                            setHasUnsavedChanges(true)
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${isDarkMode ? "border-[#00AEEC] bg-[#21262d]" : "border-gray-200 bg-white hover:border-gray-300"}`}
                        >
                          <div className="w-full h-20 bg-[#0C0C0C] border border-[#27272a] rounded-lg mb-3 flex items-center justify-center">
                            <div className="w-8 h-8 bg-[#27272a] rounded"></div>
                          </div>
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Escuro</div>
                        </button>
                      </div>
                    </div>

                    
                  </div>
                )}

                {/* Accessibility Settings */}
                {activeSection === "accessibility" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Opções de acessibilidade
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                              Reduzir animações
                            </div>
                            <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                              Diminuir ou desabilitar animações na interface
                            </div>
                          </div>
                          <button
                            onClick={() => handleInputChange("reduceAnimations", !formData.reduceAnimations)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.reduceAnimations ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.reduceAnimations ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Settings */}
                {activeSection === "language" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Idioma da interface
                      </h3>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange("language", e.target.value)}
                        className={`w-full px-4 py-3 border ${isDarkMode ? "bg-[#0C0C0C] border-[#27272a] text-white" : "bg-white border-gray-300 text-gray-900"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent`}
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                        <option value="fr-FR">Français</option>
                        <option value="ja-JP">日本語</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Data Settings */}
                {activeSection === "data" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Gerenciar dados
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isDarkMode ? "text-[#e6edf3]" : "text-gray-900"}`}>
                              Salvamento automático
                            </div>
                            <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                              Salvar automaticamente rascunhos de posts
                            </div>
                          </div>
                          <button
                            onClick={() => handleInputChange("autoSave", !formData.autoSave)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.autoSave ? "bg-[#00AEEC]" : isDarkMode ? "bg-[#27272a]" : "bg-gray-300"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.autoSave ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <button
                          className={`w-full text-left p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"} transition-all`}
                        >
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}>
                            Baixar seus dados
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            Faça o download de uma cópia dos seus dados
                          </div>
                        </button>

                        <button
                          className={`w-full text-left p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-all`}
                        >
                          <div className="font-medium text-red-900 mb-1">Excluir conta</div>
                          <div className="text-sm text-red-700">Excluir permanentemente sua conta e todos os dados</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Settings */}
                {activeSection === "help" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                        Suporte e ajuda
                      </h3>
                      <div className="space-y-4">
                        <button
                          className={`w-full text-left p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"} transition-all`}
                        >
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}>
                            Central de Ajuda
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            Encontre respostas para perguntas frequentes
                          </div>
                        </button>

                        <button
                          className={`w-full text-left p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"} transition-all`}
                        >
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}>
                            Contatar Suporte
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            Entre em contato com nossa equipe de suporte
                          </div>
                        </button>

                        <button
                          className={`w-full text-left p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"} transition-all`}
                        >
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}>
                            Reportar um problema
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            Relate bugs ou problemas técnicos
                          </div>
                        </button>

                        <button
                          className={`w-full text-left p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"} transition-all`}
                        >
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}>
                            Termos de Serviço
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            Leia nossos termos de uso
                          </div>
                        </button>

                        <button
                          className={`w-full text-left p-4 rounded-xl border ${isDarkMode ? "border-[#27272a] bg-[#0C0C0C] hover:border-[#3a3a3a]" : "border-gray-200 bg-white hover:border-gray-300"} transition-all`}
                        >
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}>
                            Política de Privacidade
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"}`}>
                            Saiba como protegemos seus dados
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className={`pt-6 border-t ${isDarkMode ? "border-[#27272a]" : "border-gray-200"}`}>
                      <div className={`text-sm ${isDarkMode ? "text-[#7d8590]" : "text-gray-600"} text-center`}>
                        <p>Versão 2.1.0</p>
                        <p className="mt-1">© 2025 coronocorp. Todos os direitos reservados.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
