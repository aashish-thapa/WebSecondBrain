'use client'

import * as React from 'react'
import { getFeed, deletePost } from '@/lib/api'
import { Post } from '@/types'
import { PostCard } from '@/components/feed/PostCard'
import { CreatePostForm } from '@/components/feed/CreatePostForm'
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton'
import { Frown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadFeed() {
      setIsLoading(true)
      try {
        // artificial delay to show skeleton
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const feed = await getFeed()
        setPosts(feed)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred while fetching the feed.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadFeed()
  }, [])

  const handlePostCreated = (newPost: Omit<Post, 'user'>) => {
    if (!user) return

    const postWithUser: Post = {
      ...newPost,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        followers: user.followers || [],
        following: user.following || [],
        createdAt: user.createdAt,
        userPreferences: user.userPreferences,
      },
    }
    setPosts([postWithUser, ...posts])
  }

  const handlePostDeleted = async (postId: string) => {
    // Optimistically remove the post from the UI
    setPosts(posts.filter((p) => p._id !== postId))

    try {
      await deletePost(postId)
    } catch (error) {
      // If the API call fails, log the error.
      // You might want to add the post back to the list or show a toast notification.
      console.error('Failed to delete post:', error)
      // For this example, we'll just log it and not revert the state.
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='space-y-6'>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )
    }

    if (error) {
      return (
        <div className='bg-white rounded-2xl border border-gray-200/80 p-8 text-center'>
          <Frown className='w-16 h-16 mx-auto text-gray-300' />
          <h2 className='mt-4 text-xl font-bold'>Could not load feed</h2>
          <p className='mt-2 text-muted-foreground'>{error}</p>
        </div>
      )
    }

    if (posts.length === 0) {
      return (
        <div className='bg-white rounded-2xl border border-gray-200/80 p-8 text-center'>
          <h2 className='mt-4 text-xl font-bold'>The feed is quiet...</h2>
          <p className='mt-2 text-muted-foreground'>
            Be the first to post a thought!
          </p>
        </div>
      )
    }

    return (
      <div className='space-y-6'>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <CreatePostForm onPostCreated={handlePostCreated} />
      {renderContent()}
    </div>
  )
}
