'use client'

import * as React from 'react'
import { PostCard } from '@/components/feed/PostCard'
import { getAllPosts } from '@/lib/api'
import { Post } from '@/types'
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton'

export default function ExplorePage() {
  const [posts, setPosts] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)
      try {
        const allPosts = await getAllPosts()
        setPosts(allPosts)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [])

  const handlePostDeleted = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId))
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Explore</h1>
      <p className='text-muted-foreground'>
        See the latest thoughts from the community.
      </p>
      <div className='space-y-6'>
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  )
}
