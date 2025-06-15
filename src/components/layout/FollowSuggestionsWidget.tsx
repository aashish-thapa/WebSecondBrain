'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'
import { getSuggestedUsers, followUser } from '@/lib/api'
import { AuthenticatedUser } from '@/types'

const MAX_INITIAL_SUGGESTIONS = 3

export function FollowSuggestionsWidget() {
  const [allSuggestions, setAllSuggestions] = React.useState<
    AuthenticatedUser[]
  >([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showAll, setShowAll] = React.useState(false)

  React.useEffect(() => {
    async function loadSuggestions() {
      try {
        const suggestedUsers = await getSuggestedUsers()
        setAllSuggestions(suggestedUsers)
      } catch (error) {
        console.error('Failed to fetch suggested users:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSuggestions()
  }, [])

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId)
      // Remove the followed user from the list
      setAllSuggestions((prev) => prev.filter((user) => user._id !== userId))
    } catch (error) {
      console.error('Failed to follow user:', error)
    }
  }

  const displayedSuggestions = showAll
    ? allSuggestions
    : allSuggestions.slice(0, MAX_INITIAL_SUGGESTIONS)

  if (isLoading) {
    return (
      <div className='bg-white p-4 rounded-2xl shadow-sm border animate-pulse'>
        <div className='h-5 bg-gray-200 rounded w-1/2 mb-4'></div>
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gray-200'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-24'></div>
                  <div className='h-3 bg-gray-200 rounded w-16'></div>
                </div>
              </div>
              <div className='h-8 bg-gray-200 rounded w-24'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white p-4 rounded-2xl shadow-sm border'>
      <h3 className='font-bold text-lg mb-4'>Who to Follow</h3>
      {allSuggestions.length > 0 ? (
        <>
          <ul className='space-y-4'>
            {displayedSuggestions.map((sugg) => (
              <li key={sugg._id} className='flex items-center justify-between'>
                <Link href={`/profile/${sugg.username}`} className='group'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0'>
                      {sugg.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className='font-bold group-hover:underline'>
                        {sugg.username}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        @{sugg.username}
                      </p>
                    </div>
                  </div>
                </Link>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-shrink-0'
                  onClick={() => handleFollow(sugg._id)}
                >
                  <UserPlus className='w-4 h-4 mr-2' />
                  Follow
                </Button>
              </li>
            ))}
          </ul>
          {allSuggestions.length > MAX_INITIAL_SUGGESTIONS && !showAll && (
            <div className='mt-4'>
              <Button
                variant='link'
                className='p-0 h-auto'
                onClick={() => setShowAll(true)}
              >
                View all
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className='text-sm text-muted-foreground'>No suggestions for now.</p>
      )}
    </div>
  )
}
