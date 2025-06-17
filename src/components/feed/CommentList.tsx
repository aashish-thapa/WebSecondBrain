'use client'

import { Comment as CommentType } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

interface CommentListProps {
  comments: CommentType[]
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className='bg-white rounded-2xl border p-6 text-center'>
        <p className='text-muted-foreground font-medium'>
          Be the first to comment.
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl border'>
      <h3 className='font-bold text-lg p-4 border-b'>Comments</h3>
      <ul className='divide-y'>
        {comments.map((comment) => (
          <li key={comment._id} className='p-4 flex items-start gap-4'>
            <Link href={`/profile/${comment.user.username}`}>
              <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 relative overflow-hidden'>
                {comment.user.profilePicture ? (
                  <Image
                    src={comment.user.profilePicture}
                    alt={comment.user.username}
                    layout='fill'
                    objectFit='cover'
                  />
                ) : (
                  comment.user.username.charAt(0).toUpperCase()
                )}
              </div>
            </Link>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <Link
                  href={`/profile/${comment.user.username}`}
                  className='font-bold hover:underline'
                >
                  {comment.user.username}
                </Link>
                <p className='text-xs text-muted-foreground'>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <p className='mt-1 text-foreground/90'>{comment.text}</p>
              {comment.image && (
                <div className='mt-2 relative overflow-hidden rounded-lg border'>
                  <Image
                    src={comment.image}
                    alt='Comment image'
                    width={300}
                    height={300}
                    className='w-full h-auto object-cover'
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
