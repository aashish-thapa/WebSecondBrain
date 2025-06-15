'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'

const suggestions = [
  { username: 'CamusFan', name: 'Albert C.' },
  { username: 'SartreReader', name: 'Jean-Paul S.' },
  { username: 'SimoneDeB', name: 'Simone B.' },
]

export function FollowSuggestionsWidget() {
  return (
    <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80'>
      <h3 className='font-bold text-lg mb-4'>Who to Follow</h3>
      <ul className='space-y-4'>
        {suggestions.map((sugg) => (
          <li key={sugg.username} className='flex items-center justify-between'>
            <Link href={`/profile/${sugg.username}`} className='group'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold flex-shrink-0'>
                  {sugg.name.charAt(0)}
                </div>
                <div>
                  <p className='font-bold group-hover:underline'>{sugg.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    @{sugg.username}
                  </p>
                </div>
              </div>
            </Link>
            <Button size='sm' variant='outline' className='flex-shrink-0'>
              <UserPlus className='w-4 h-4 mr-2' />
              Follow
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
