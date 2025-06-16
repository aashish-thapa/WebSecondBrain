import { getAllPosts, searchUsers } from '@/lib/api'
import { MetadataRoute } from 'next'

const URL = 'https://sayitloud.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all posts
  const posts = await getAllPosts()
  const postUrls = posts.map((post) => ({
    url: `${URL}/post/${post._id}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Fetch all users
  // Note: This assumes you have an endpoint to get all users or you can search with an empty query
  const users = await searchUsers('')
  const userUrls = users.map((user) => ({
    url: `${URL}/profile/${user.username}`,
    lastModified: new Date(), // User model doesn't have an updatedAt, using current date
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Static pages
  const staticUrls = [
    {
      url: `${URL}/feed`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...userUrls, ...postUrls]
}
