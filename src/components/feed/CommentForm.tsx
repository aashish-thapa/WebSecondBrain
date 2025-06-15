'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/contexts/AuthContext'
import { commentOnPost } from '@/lib/api'
import { Comment as CommentType } from '@/types'
import { SendHorizonal } from 'lucide-react'
import Link from 'next/link'

interface CommentFormProps {
  postId: string
  onCommentCreated: (newComment: CommentType) => void
}

export function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const { user } = useAuth()
  const [text, setText] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!text.trim() || !user) return

    setIsLoading(true)
    try {
      const newComment = await commentOnPost(postId, text)
      onCommentCreated(newComment)
      setText('')
    } catch (error) {
      console.error('Failed to post comment:', error)
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className='bg-white rounded-2xl border p-4 text-center'>
        <p className='text-muted-foreground'>
          You must be{' '}
          <Link href='/login' className='text-primary hover:underline'>
            logged in
          </Link>{' '}
          to comment.
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl border p-4'>
      <form onSubmit={handleSubmit} className='flex items-start gap-4'>
        <Link href={`/profile/${user.username}`}>
          <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0'>
            {user.username.charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className='flex-1 space-y-3'>
          <Textarea
            placeholder='Add a comment...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            rows={2}
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading || !text.trim()}>
              {isLoading ? 'Posting...' : 'Post Comment'}
              <SendHorizonal className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
