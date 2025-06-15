export interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
  followers: string[]
  following: string[]
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

export interface AIAnalysisResponse {
  postId: string
  content: string
  aiAnalysis: AIAnalysis
  message: string
}
