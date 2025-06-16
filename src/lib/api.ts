import {
  AuthenticatedUser,
  Post,
  Comment as CommentType,
  AIAnalysisResponse,
  Notification,
  User,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function fetcher(
  url: string,
  options: RequestInit = {},
  isFormData = false
) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers = new Headers(options.headers)
  if (!isFormData) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid or expired.
      // Clear local storage and force a reload to redirect to login.
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      // Return a promise that will not resolve to prevent further processing
      return new Promise(() => {})
    }
    const errorData = await response.json()
    throw new Error(errorData.message || 'Something went wrong')
  }

  // If status is 204 No Content, the body is empty and parsing is not needed.
  if (response.status === 204) {
    return { success: true }
  }

  // For other successful responses, try to parse JSON.
  // If parsing fails (e.g., empty body on a 200 OK), return a generic success object.
  try {
    return await response.json()
  } catch {
    return { success: true }
  }
}

// I. Auth Endpoints
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

export async function getProfile(): Promise<AuthenticatedUser> {
  return fetcher(`${API_URL}/auth/profile`)
}

export async function searchUsers(query: string): Promise<AuthenticatedUser[]> {
  return fetcher(`${API_URL}/auth/search?username=${query}`)
}

export async function getSuggestedUsers(): Promise<AuthenticatedUser[]> {
  return fetcher(`${API_URL}/auth/suggested`)
}

export async function getUserById(userId: string): Promise<User> {
  return fetcher(`${API_URL}/auth/${userId}`)
}

export async function followUser(userId: string): Promise<AuthenticatedUser> {
  return fetcher(`${API_URL}/auth/follow/${userId}`, {
    method: 'PUT',
  })
}

export async function unfollowUser(userId: string): Promise<AuthenticatedUser> {
  return fetcher(`${API_URL}/auth/unfollow/${userId}`, {
    method: 'PUT',
  })
}

// II. Post Endpoints
export async function getFeed(): Promise<Post[]> {
  return fetcher(`${API_URL}/posts/feed`)
}

export async function getAllPosts(): Promise<Post[]> {
  return fetcher(`${API_URL}/posts`)
}

export async function getPostById(postId: string): Promise<Post> {
  return fetcher(`${API_URL}/posts/${postId}`)
}

export async function createPost(postData: {
  content: string
  image?: File
}): Promise<Post> {
  // If there is an image, use FormData
  if (postData.image) {
    const formData = new FormData()
    formData.append('content', postData.content)
    formData.append('image', postData.image)

    return fetcher(
      `${API_URL}/posts`,
      {
        method: 'POST',
        body: formData,
      },
      true // Pass true to indicate this is a FormData request
    )
  }

  // Otherwise, send as JSON
  return fetcher(`${API_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify({ content: postData.content }),
  })
}

export async function deletePost(postId: string): Promise<{ message: string }> {
  return fetcher(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
  })
}

export async function likePost(postId: string): Promise<Post> {
  return fetcher(`${API_URL}/posts/${postId}/like`, {
    method: 'PUT',
  })
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

export async function searchPostsByTopic(query: string): Promise<Post[]> {
  return fetcher(`${API_URL}/posts/by-topic?topic=${query}`)
}

export async function getTrendingTopics(): Promise<
  { topic: string; count: number }[]
> {
  return fetcher(`${API_URL}/posts/trending-topics`)
}

// III. AI Endpoints
export async function analyzePost(postId: string): Promise<AIAnalysisResponse> {
  return fetcher(`${API_URL}/ai/analyze/${postId}`, {
    method: 'POST',
  })
}

// IV. Notification Endpoints
export async function getNotifications(): Promise<Notification[]> {
  return fetcher(`${API_URL}/notifications`)
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<{ message: string; notification: Notification }> {
  return fetcher(`${API_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
  })
}

export async function markAllNotificationsAsRead(): Promise<{
  message: string
}> {
  return fetcher(`${API_URL}/notifications/read-all`, {
    method: 'PUT',
  })
}
