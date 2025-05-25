import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserProfile } from "@/hooks/use-profile"
import { Trophy } from "lucide-react"

interface ProfileSidebarProps {
  userProfile: UserProfile
}

export function ProfileSidebar({ userProfile }: ProfileSidebarProps) {
  return (
    <div className="lg:w-80 space-y-6" style={{ marginTop: "10px" }}>
      {/* Badges Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-pink-500" />
            Conquistas e Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {userProfile.badges.slice(0, 6).map((badge, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-medium text-gray-900 truncate">{badge.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
