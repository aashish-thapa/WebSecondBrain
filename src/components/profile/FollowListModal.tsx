'use client'

import * as React from 'react'
import { User } from '@/types'
import { ScrollArea } from '@/components/ui/ScrollArea'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface FollowListModalProps {
  title: string
  users: Pick<User, '_id' | 'username' | 'profilePicture'>[]
  onClose: () => void
}

export function FollowListModal({
  title,
  users,
  onClose,
}: FollowListModalProps) {
  return (
    <div
      className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-xl w-full max-w-md mx-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b flex items-center justify-between'>
          <h2 className='font-bold text-lg'>{title}</h2>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <ScrollArea className='h-[60vh]'>
          {users.length === 0 ? (
            <p className='text-muted-foreground text-center py-8'>
              This list is empty.
            </p>
          ) : (
            <ul className='divide-y'>
              {users.map((user) => (
                <li key={user._id}>
                  <Link
                    href={`/profile/${user.username}`}
                    className='flex items-center gap-4 p-4 hover:bg-gray-50'
                    onClick={onClose}
                  >
                    <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0'>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className='font-bold'>{user.username}</p>
                      <p className='text-sm text-muted-foreground'>
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
