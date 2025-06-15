'use client'

import { Post } from '@/types'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Heart, Share2, BarChart2, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import * as React from 'react'
import { likePost, deletePost } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface PostCardProps {
  post: Post
  onPostDeleted: (postId: string) => void
}

export function PostCard({ post, onPostDeleted }: PostCardProps) {
  const { user } = useAuth()

  const [likes, setLikes] = React.useState(post.likes.length)
  const [isLiked, setIsLiked] = React.useState(
    user ? post.likes.includes(user._id) : false
  )
  const [isLiking, setIsLiking] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleLike = async () => {
    if (!user || isLiking) return
    setIsLiking(true)

    const originalLikes = likes
    const originalIsLiked = isLiked

    // Optimistic update
    setLikes(isLiked ? likes - 1 : likes + 1)
    setIsLiked(!isLiked)

    try {
      await likePost(post._id)
      // If the API call succeeds, the optimistic update was correct.
      // We don't need to do anything with the response.
    } catch (error) {
      console.error('Failed to like post:', error)
      // Revert on error
      setLikes(originalLikes)
      setIsLiked(originalIsLiked)
    } finally {
      setIsLiking(false)
    }
  }

  const isOwner = user && user._id === post.user._id

  const handleDelete = async () => {
    if (!isOwner) return

    // Here you would typically show a confirmation modal first
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?'
    )
    if (!confirmDelete) {
      return
    }

    setIsDeleting(true)
    try {
      await deletePost(post._id)
      onPostDeleted(post._id)
    } catch (error) {
      console.error('Failed to delete post on server:', error)
      // Optionally show an error to the user
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 transition-all hover:shadow-md'>
      <div className='flex items-start gap-4'>
        <Link href={`/profile/${post.user.username}`}>
          <div className='w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0'>
            {post.user.username.charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <Link href={`/profile/${post.user.username}`} className='group'>
              <p className='font-bold group-hover:underline'>
                {post.user.username}
              </p>
              <p className='text-sm text-muted-foreground'>
                @{post.user.username}
              </p>
            </Link>
            <p className='text-xs text-muted-foreground flex-shrink-0'>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <Link href={`/post/${post._id}`} className='group'>
            <p className='mt-3 text-base text-foreground/90 whitespace-pre-wrap group-hover:text-primary/80 transition-colors'>
              {post.content}
            </p>
          </Link>
        </div>
      </div>
      <div className='mt-4 pl-12 sm:pl-16 flex justify-between items-center text-muted-foreground'>
        <div className='flex items-center gap-6'>
          <Link
            href={`/post/${post._id}`}
            className='flex items-center gap-2 text-xs hover:text-primary transition-colors'
          >
            <MessageCircle className='w-4 h-4' /> {post.comments.length}
          </Link>
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              'flex items-center gap-2 text-xs hover:text-rose-500 transition-colors',
              {
                'text-rose-500': isLiked,
              }
            )}
          >
            <Heart className={cn('w-4 h-4', { 'fill-current': isLiked })} />{' '}
            {likes}
          </button>
          <button className='flex items-center gap-2 text-xs hover:text-green-500 transition-colors'>
            <Share2 className='w-4 h-4' />
          </button>
        </div>
        <div className='flex items-center gap-4'>
          <div className='text-xs flex items-center gap-2 bg-secondary text-secondary-foreground py-1 px-2.5 rounded-full'>
            <BarChart2 className='w-3.5 h-3.5' />
            <span>{post.aiAnalysis.category}</span>
          </div>
          {isOwner && (
            <Button
              onClick={handleDelete}
              variant='ghost'
              size='icon'
              className='w-8 h-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
              disabled={isDeleting}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
