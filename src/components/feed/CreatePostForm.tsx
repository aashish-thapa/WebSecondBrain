'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { createPost, analyzePost } from '@/lib/api'
import { Post } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { SendHorizonal } from 'lucide-react'
import Link from 'next/link'

interface CreatePostFormProps {
  onPostCreated: (newPost: Omit<Post, 'user'>) => void
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { user } = useAuth()
  const [content, setContent] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!content.trim() || !user) return

    setIsLoading(true)
    setError(null)

    try {
      const newPost = await createPost({ content })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user: _, ...postWithoutUser } = newPost
      onPostCreated(postWithoutUser)
      setContent('')

      // Fire-and-forget AI analysis
      analyzePost(newPost._id)
        .then((analysisResult) => {
          console.log('AI Analysis triggered:', analysisResult)
          // Here you could potentially update the post in the feed with the new analysis data
        })
        .catch((err) => {
          console.error('AI Analysis failed to trigger:', err)
        })
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
    return null // Or a login prompt
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
            placeholder={`What's on your mind, ${user.username}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            rows={3}
            className='bg-gray-50/50 border-gray-200/90 focus:bg-white'
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading || !content.trim()}>
              {isLoading ? 'Posting...' : 'Post Thought'}
              {!isLoading && <SendHorizonal className='w-4 h-4 ml-2' />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
