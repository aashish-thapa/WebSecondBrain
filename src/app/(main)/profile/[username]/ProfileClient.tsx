'use client'

import * as React from 'react'
import {
  getFeed,
  followUser,
  unfollowUser,
  getProfile,
  searchUsers,
  getUserById,
} from '@/lib/api'
import { Post, User } from '@/types'
import { PostCard } from '@/components/feed/PostCard'
import { Frown, CalendarDays, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton'
import { FollowListModal } from '@/components/profile/FollowListModal'
import { EditProfileModal } from '@/components/modals/EditProfileModal'
import Image from 'next/image'

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
  const { user: currentUser, updateUser } = useAuth()
  const [profile, setProfile] = React.useState<User | null>(null)
  const [posts, setPosts] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [modalContent, setModalContent] = React.useState<{
    title: string
    users: User['followers']
  } | null>(null)

  const isFollowing = React.useMemo(() => {
    return currentUser?.following?.some((f) => f._id === profile?._id) ?? false
  }, [currentUser?.following, profile?._id])

  React.useEffect(() => {
    async function loadAllData() {
      if (!username) return
      setIsLoading(true)
      setError(null)
      try {
        let profileData: User
        // If viewing own profile, use the dedicated getProfile endpoint
        if (currentUser && currentUser.username === username) {
          profileData = await getProfile()
        } else {
          // Otherwise, search for the user to get their ID, then full profile
          const users = await searchUsers(username)
          if (users.length === 0) {
            throw new Error('User not found.')
          }
          profileData = await getUserById(users[0]._id)
        }
        setProfile(profileData)

        // Fetch posts for the displayed profile
        const allPosts = await getFeed()
        const userPosts = allPosts.filter((p) => p.user.username === username)
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

    loadAllData()
    // This effect should re-run when the user navigates to a new profile,
    // or when the logged-in user's data might have changed.
  }, [username, currentUser?._id])

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return

    try {
      if (isFollowing) {
        await unfollowUser(profile._id)
      } else {
        await followUser(profile._id)
      }
      // Re-fetch the logged-in user's profile to get updated following list
      const updatedUser = await getProfile()
      updateUser(updatedUser)
    } catch (err) {
      console.error('Failed to toggle follow state:', err)
      // Optionally show an error to the user
    }
  }

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p._id !== postId))
  }

  const isOwnProfile = currentUser?._id === profile?._id

  const handleProfileUpdate = (updatedUser: User) => {
    // We only update the parts of the profile that could have changed
    setProfile((prev) => ({
      ...prev,
      ...updatedUser,
    }))
  }

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
          <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-5xl relative overflow-hidden'>
            {profile.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={profile.username}
                layout='fill'
                objectFit='cover'
              />
            ) : (
              profile.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold'>{profile.username}</h2>
                <p className='text-muted-foreground'>@{profile.username}</p>
              </div>
              {isOwnProfile ? (
                <EditProfileModal onProfileUpdate={handleProfileUpdate}>
                  <Button variant='outline'>Edit Profile</Button>
                </EditProfileModal>
              ) : (
                <Button onClick={handleFollowToggle}>
                  <UserPlus className='w-4 h-4 mr-2' />
                  {isFollowing ? 'Unfollow' : 'Follow'}
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
          <button
            className='hover:underline'
            onClick={() =>
              setModalContent({
                title: 'Following',
                users: profile.following,
              })
            }
          >
            <span className='font-bold'>{profile.following?.length || 0}</span>{' '}
            Following
          </button>
          <button
            className='hover:underline'
            onClick={() =>
              setModalContent({
                title: 'Followers',
                users: profile.followers,
              })
            }
          >
            <span className='font-bold'>{profile.followers?.length || 0}</span>{' '}
            Followers
          </button>
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
      {modalContent && (
        <FollowListModal
          title={modalContent.title}
          users={modalContent.users}
          onClose={() => setModalContent(null)}
        />
      )}
    </div>
  )
}
