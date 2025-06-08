import { TopNav } from "@/components/top-nav"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import ProfilePage from "@/components/profile-page"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <TopNav />
      <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
        <LeftSidebar className="hidden md:block" />
        <div className="flex-1">
          <ProfilePage />
        </div>
        <RightSidebar className="hidden lg:block" />
      </div>
    </div>
  )
}
