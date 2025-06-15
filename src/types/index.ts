export interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
  followers: Pick<User, '_id' | 'username' | 'profilePicture'>[]
  following: Pick<User, '_id' | 'username' | 'profilePicture'>[]
  createdAt: string
  userPreferences: {
    likedCategories: Record<string, number>
    likedTopics: Record<string, number>
  }
}

export interface AuthenticatedUser extends User {
  token: string
  password?: string
}

export interface Comment {
  _id: string
  user: User
  text: string
  createdAt: string
}

export interface AIAnalysis {
  sentiment: string
  emotions: { emotion: string; score: number }[]
  toxicity: {
    detected: boolean
    details: Record<string, number>
  }
  topics: string[]
  summary: string
  category: string
}

export interface Post {
  _id: string
  user: User
  content: string
  image?: string
  likes: string[]
  comments: Comment[]
  aiAnalysis: AIAnalysis
  createdAt: string
  updatedAt: string
  relevanceScore?: number
}

export interface Notification {
  _id: string
  recipient: string
  type: 'like' | 'comment' | 'follow'
  initiator: {
    _id: string
    username: string
    profilePicture?: string
  }
  post?: {
    _id: string
    content: string
  }
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export interface AIAnalysisResponse {
  postId: string
  content: string
  aiAnalysis: AIAnalysis
  message: string
}
