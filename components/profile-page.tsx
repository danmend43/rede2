"use client"

import { useState } from "react"
import { useProfile } from "@/hooks/use-profile"
import { Header } from "./header"
import { ProfileCover } from "./profile-cover"
import { ProfileInfo } from "./profile-info"
import { ProfileSidebar } from "./profile-sidebar"
import { ProfileTabs } from "./profile-tabs"
import { CreatePostModal } from "./create-post-modal"
import { YouTubeModal } from "./youtube-modal"
import { EditProfileModal } from "./edit-profile-modal"
import { AvatarModal } from "./avatar-modal"
import { Footer } from "./footer"

export default function ProfilePage() {
  const {
    userProfile,
    setUserProfile,
    userPosts,
    setUserPosts,
    userVideos,
    setUserVideos,
    coverImage,
    setCoverImage,
    avatarImage,
    setAvatarImage,
    addLocalVideo,
    addPost,
  } = useProfile()

  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [currentYouTubeUrl, setCurrentYouTubeUrl] = useState("")
  const [currentVideoData, setCurrentVideoData] = useState<any>(null)

  const openYouTubeModal = (url: string, videoData?: any) => {
    setCurrentYouTubeUrl(url)
    setCurrentVideoData(videoData)
    setShowYouTubeModal(true)
  }

  const closeYouTubeModal = () => {
    setShowYouTubeModal(false)
    setCurrentYouTubeUrl("")
    setCurrentVideoData(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onCreatePost={() => setShowCreatePostModal(true)} avatarImage={avatarImage} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Cover Image */}
        <ProfileCover coverImage={coverImage} onEditProfile={() => setShowEditProfileModal(true)} />

        {/* Profile Section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Profile Info */}
            <ProfileInfo
              userProfile={userProfile}
              avatarImage={avatarImage}
              onAvatarClick={() => setShowAvatarModal(true)}
            />

            {/* Right Column - Sidebar */}
            <ProfileSidebar userProfile={userProfile} />
          </div>
        </div>

        {/* Main Content - Tabs */}
        <div className="px-6 pb-8">
          <ProfileTabs
            userPosts={userPosts}
            userVideos={userVideos}
            userProfile={userProfile}
            avatarImage={avatarImage}
            onOpenYouTube={openYouTubeModal}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {showCreatePostModal && (
        <CreatePostModal
          userProfile={userProfile}
          avatarImage={avatarImage}
          onClose={() => setShowCreatePostModal(false)}
          onAddPost={addPost}
          onAddVideo={addLocalVideo}
        />
      )}

      {showYouTubeModal && (
        <YouTubeModal
          url={currentYouTubeUrl}
          videoData={currentVideoData}
          userProfile={userProfile}
          avatarImage={avatarImage}
          onClose={closeYouTubeModal}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          avatarImage={avatarImage}
          setAvatarImage={setAvatarImage}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}

      {showAvatarModal && <AvatarModal avatarImage={avatarImage} onClose={() => setShowAvatarModal(false)} />}
    </div>
  )
}
