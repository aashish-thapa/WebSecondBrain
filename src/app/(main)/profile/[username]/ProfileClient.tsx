'use client'

import * as React from 'react'
import { getFeed } from '@/lib/api'
import { Post, User } from '@/types'
import { PostCard } from '@/components/feed/PostCard'
import { Frown, CalendarDays, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton'

interface ProfileClientProps {
  username: string
}

// A simple skeleton for the profile header
function ProfileHeaderSkeleton() {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm border animate-pulse'>
      <div className='flex items-center gap-6'>
        <div className='w-24 h-24 rounded-full bg-gray-200'></div>
        <div className='space-y-3'>
          <div className='h-6 bg-gray-200 rounded w-48'></div>
          <div className='h-4 bg-gray-200 rounded w-32'></div>
          <div className='h-4 bg-gray-200 rounded w-40'></div>
        </div>
      </div>
      <div className='mt-4 flex items-center gap-6'>
        <div className='h-4 bg-gray-200 rounded w-20'></div>
        <div className='h-4 bg-gray-200 rounded w-20'></div>
      </div>
    </div>
  )
}

export default function ProfileClient({ username }: ProfileClientProps) {
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = React.useState<User | null>(null)
  const [posts, setPosts] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadProfileAndPosts() {
      setIsLoading(true)
      setError(null)
      try {
        // Since there is no dedicated endpoint for a user's posts,
        // we fetch the entire feed and filter it.
        const allPosts = await getFeed()
        const userPosts = allPosts.filter((p) => p.user.username === username)

        if (userPosts.length > 0) {
          // Extract profile information from the first post
          setProfile(userPosts[0].user)
        } else {
          // Handle case where user exists but has no posts - this part of the UI
          // would ideally be powered by a dedicated /api/users/:username endpoint.
          // For now, we show a "not found" state if no posts are found.
          setError('User not found or has not posted yet.')
        }
        setPosts(userPosts)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('An unknown error occurred while fetching the profile.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      loadProfileAndPosts()
    }
  }, [username])

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p._id !== postId))
  }

  const isOwnProfile = currentUser?._id === profile?._id

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <ProfileHeaderSkeleton />
        <PostCardSkeleton />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className='bg-white rounded-2xl border border-gray-200/80 p-8 text-center'>
        <Frown className='w-16 h-16 mx-auto text-gray-300' />
        <h2 className='mt-4 text-xl font-bold'>Could not load profile</h2>
        <p className='mt-2 text-muted-foreground'>
          {error || 'This user may not exist.'}
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Profile Header */}
      <div className='bg-white rounded-2xl p-6 shadow-sm border'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-6'>
          <div className='w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-5xl flex-shrink-0'>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold'>{profile.username}</h2>
                <p className='text-muted-foreground'>@{profile.username}</p>
              </div>
              {isOwnProfile ? (
                <Button variant='outline'>Edit Profile</Button>
              ) : (
                <Button>
                  <UserPlus className='w-4 h-4 mr-2' />
                  Follow
                </Button>
              )}
            </div>
            <div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
              <CalendarDays className='w-4 h-4' />
              {/* The full user object with createdAt is not available here, so we omit it for now */}
              {/* Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} */}
            </div>
          </div>
        </div>
        <div className='mt-6 pt-6 border-t flex items-center gap-6 text-sm'>
          {/* The full user object with follower counts is not available here, so we show placeholders */}
          <p>
            <span className='font-bold'>{profile.following?.length || 0}</span>{' '}
            Following
          </p>
          <p>
            <span className='font-bold'>{profile.followers?.length || 0}</span>{' '}
            Followers
          </p>
        </div>
      </div>

      {/* User's Posts */}
      <h3 className='text-xl font-bold'>Posts</h3>
      <div className='space-y-6'>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))
        ) : (
          <div className='bg-white rounded-2xl border border-gray-200/80 p-8 text-center'>
            <p className='text-muted-foreground font-medium'>
              This user hasn&apos;t posted anything yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
