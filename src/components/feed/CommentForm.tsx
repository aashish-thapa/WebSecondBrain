'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { commentOnPost } from '@/lib/api'
import { Comment as CommentType } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
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
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!text.trim() || !user) return

    setIsLoading(true)
    setError(null)

    try {
      const newComment = await commentOnPost(postId, text)
      onCommentCreated(newComment)
      setText('')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 text-center'>
        <p className='text-muted-foreground'>
          <Link
            href='/login'
            className='text-primary hover:underline font-semibold'
          >
            Log in
          </Link>{' '}
          to post a comment.
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5'>
      <form onSubmit={handleSubmit} className='flex items-start gap-4'>
        <Link href={`/profile/${user.username}`}>
          <div className='w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0'>
            {user.username.charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className='flex-1 space-y-3'>
          {error && <p className='text-destructive text-sm'>{error}</p>}
          <Textarea
            placeholder='Post your reply...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            rows={3}
            className='bg-gray-50/50 border-gray-200/90 focus:bg-white'
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading || !text.trim()}>
              {isLoading ? 'Replying...' : 'Reply'}
              {!isLoading && <SendHorizonal className='w-4 h-4 ml-2' />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
