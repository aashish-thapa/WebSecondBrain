'use client'

import { Comment as CommentType } from '@/types'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface CommentListProps {
  comments: CommentType[]
}

function CommentItem({ comment }: { comment: CommentType }) {
  return (
    <div className='flex items-start gap-4 py-4'>
      <Link href={`/profile/${comment.user.username}`}>
        <div className='w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-base flex-shrink-0'>
          {comment.user.username.charAt(0).toUpperCase()}
        </div>
      </Link>
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <Link href={`/profile/${comment.user.username}`} className='group'>
            <p className='font-bold group-hover:underline text-sm'>
              {comment.user.username}
            </p>
          </Link>
          <p className='text-xs text-muted-foreground flex-shrink-0'>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <p className='mt-1 text-base text-foreground/90 whitespace-pre-wrap'>
          {comment.text}
        </p>
      </div>
    </div>
  )
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8 text-center'>
        <p className='text-muted-foreground font-medium'>No comments yet.</p>
        <p className='text-sm text-muted-foreground'>
          Be the first to share your thoughts!
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80'>
      <h3 className='font-bold text-lg p-5 border-b'>Replies</h3>
      <div className='divide-y px-5'>
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
