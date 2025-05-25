"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PostsTab } from "./posts-tab"
import { VideosTab } from "./videos-tab"
import { CollectionsTab } from "./collections-tab"
import { AchievementsTab } from "./achievements-tab"
import type { Post, UserProfile } from "@/hooks/use-profile"
import { Grid3X3, List } from "lucide-react"

interface ProfileTabsProps {
  userPosts: Post[]
  userVideos: Post[]
  userProfile: UserProfile
  avatarImage: string
  onOpenYouTube: (url: string, videoData?: any) => void
}

export function ProfileTabs({ userPosts, userVideos, userProfile, avatarImage, onOpenYouTube }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [viewMode, setViewMode] = useState("grid")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="collections">Coleções</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        {(activeTab === "posts" || activeTab === "videos") && (
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Posts Tab - Inclui texto, imagens e YouTube */}
      <TabsContent value="posts">
        <PostsTab
          userPosts={userPosts}
          userProfile={userProfile}
          avatarImage={avatarImage}
          viewMode={viewMode}
          onOpenYouTube={onOpenYouTube}
        />
      </TabsContent>

      {/* Videos Tab - Apenas vídeos locais */}
      <TabsContent value="videos">
        <VideosTab userVideos={userVideos} userProfile={userProfile} avatarImage={avatarImage} viewMode={viewMode} />
      </TabsContent>

      {/* Collections Tab */}
      <TabsContent value="collections">
        <CollectionsTab />
      </TabsContent>

      {/* Achievements Tab */}
      <TabsContent value="achievements">
        <AchievementsTab />
      </TabsContent>
    </Tabs>
  )
}
