import {
  AuthenticatedUser,
  Post,
  Comment as CommentType,
  AIAnalysisResponse,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function fetcher(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Something went wrong')
  }

  return response.json()
}

export async function signup(
  userData: Pick<AuthenticatedUser, 'username' | 'email' | 'password'>
): Promise<AuthenticatedUser> {
  return fetcher(`${API_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function login(
  credentials: Pick<AuthenticatedUser, 'email' | 'password'>
): Promise<AuthenticatedUser> {
  return fetcher(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function getFeed(): Promise<Post[]> {
  return fetcher(`${API_URL}/posts/feed`)
}

export async function createPost(postData: {
  content: string
  image?: string
}): Promise<Post> {
  return fetcher(`${API_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify(postData),
  })
}

export async function likePost(postId: string): Promise<Post> {
  return fetcher(`${API_URL}/posts/${postId}/like`, {
    method: 'PUT',
  })
}

export async function deletePost(postId: string): Promise<{ message: string }> {
  return fetcher(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
  })
}

export async function getPostById(postId: string): Promise<Post> {
  return fetcher(`${API_URL}/posts/${postId}`)
}

export async function commentOnPost(
  postId: string,
  text: string
): Promise<CommentType> {
  return fetcher(`${API_URL}/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export async function getProfile(): Promise<AuthenticatedUser> {
  return fetcher(`${API_URL}/auth/profile`)
}

export async function analyzePost(postId: string): Promise<AIAnalysisResponse> {
  return fetcher(`${API_URL}/ai/analyze/${postId}`, {
    method: 'POST',
  })
}
