'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/contexts/AuthContext'
import { commentOnPost } from '@/lib/api'
import { Comment as CommentType } from '@/types'
import { SendHorizonal, ImageIcon, Smile, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'

interface CommentFormProps {
  postId: string
  onCommentCreated: (newComment: CommentType) => void
}

export function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const { user } = useAuth()
  const [text, setText] = React.useState('')
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prevContent) => prevContent + emojiData.emoji)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!text.trim() || !user) return

    setIsLoading(true)
    try {
      const newComment = await commentOnPost(postId, {
        text,
        image: imageFile || undefined,
      })
      onCommentCreated(newComment)
      setText('')
      removeImage()
      setShowEmojiPicker(false)
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
          <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 relative overflow-hidden'>
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.username}
                layout='fill'
                objectFit='cover'
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
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
          {imagePreview && (
            <div className='relative'>
              <Image
                src={imagePreview}
                alt='Image preview'
                width={200}
                height={200}
                className='rounded-lg object-cover w-full max-h-40'
              />
              <Button
                size='icon'
                variant='destructive'
                className='absolute top-2 right-2 h-6 w-6 rounded-full'
                onClick={removeImage}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          )}
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-1'>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
                accept='image/png, image/jpeg, image/gif'
                disabled={isLoading}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <ImageIcon className='w-5 h-5 text-primary' />
              </Button>
              <div className='relative'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={isLoading}
                >
                  <Smile className='w-5 h-5 text-primary' />
                </Button>
                {showEmojiPicker && (
                  <div className='absolute z-10 mt-2'>
                    <EmojiPicker onEmojiClick={onEmojiClick} height={350} />
                  </div>
                )}
              </div>
            </div>
            <Button
              type='submit'
              disabled={isLoading || (!text.trim() && !imageFile)}
            >
              {isLoading ? 'Posting...' : 'Post Comment'}
              <SendHorizonal className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
