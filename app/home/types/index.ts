export interface Community {
  id: number
  name: string
  avatar: string
  coverImage: string
  members: number
  online: number
  description: string
  createdAt: string
  isPublic: boolean
  category: string
  activeMembers: number
}

export interface Post {
  id: number
  user: string
  avatar: string
  time: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  community?: string
  communityAvatar?: string
  communityTag?: string
  isLiked?: boolean
  isBookmarked?: boolean
  userLevel?: number
  tags?: string[]
  verificationBadge?: "green" | "blue" | "yellow" | null
  isSponsored?: boolean
  sponsorInfo?: {
    title: string
    buttonText: string
    buttonUrl: string
    disclaimer: string
  }
}

export interface Short {
  id: number
  user: string
  avatar: string
  thumbnail: string
  title: string
  views: number
  duration: string
  verificationBadge?: "green" | "blue" | "yellow" | null
}

export interface Em LataTopic {
  id: number
  name: string
  posts: number
  trend: "up" | "down" | "stable"
  category: string
}

export interface SuggestedUser {
  id: number
  name: string
  avatar: string
  mutualFriends: number
  isFollowing: boolean
  verificationBadge?: "green" | "blue" | "yellow" | null
}
