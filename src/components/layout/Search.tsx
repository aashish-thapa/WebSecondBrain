'use client'

import * as React from 'react'
import { Input } from '@/components/ui/Input'
import { Search as SearchIcon } from 'lucide-react'
import { searchUsers, searchPostsByTopic } from '@/lib/api'
import { AuthenticatedUser, Post } from '@/types'
import Link from 'next/link'
import { useDebounce } from '@/lib/hooks/useDebounce' // Assuming a debounce hook exists

export function Search() {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<{
    users: AuthenticatedUser[]
    posts: Post[]
  }>({ users: [], posts: [] })
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true)
      Promise.all([
        searchUsers(debouncedQuery),
        searchPostsByTopic(debouncedQuery),
      ])
        .then(([users, posts]) => {
          setResults({ users, posts })
        })
        .catch((error) => console.error('Search failed:', error))
        .finally(() => setIsLoading(false))
    } else {
      setResults({ users: [], posts: [] })
    }
  }, [debouncedQuery])

  return (
    <div className='relative w-full max-w-lg'>
      <Input
        type='search'
        placeholder='Search for ideas, topics, or people...'
        className='pl-10 h-10 bg-gray-100 border-transparent focus:bg-white focus:border-primary'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click
      />
      <div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none'>
        <SearchIcon className='h-5 w-5 text-muted-foreground' />
      </div>

      {isFocused && (query.length > 0 || isLoading) && (
        <div className='absolute top-full mt-2 w-full bg-white rounded-lg border shadow-lg z-50 max-h-[70vh] overflow-y-auto'>
          {isLoading && (
            <div className='p-4 text-center text-muted-foreground'>
              Searching...
            </div>
          )}
          {!isLoading &&
            results.users.length === 0 &&
            results.posts.length === 0 && (
              <div className='p-4 text-center text-muted-foreground'>
                No results found for &quot;{query}&quot;.
              </div>
            )}

          {results.users.length > 0 && (
            <div>
              <h4 className='text-xs font-bold text-muted-foreground uppercase p-3 pb-1'>
                People
              </h4>
              <ul>
                {results.users.map((user) => (
                  <li key={user._id}>
                    <Link
                      href={`/profile/${user.username}`}
                      className='flex items-center gap-3 p-3 hover:bg-gray-100'
                      onClick={() => setQuery('')}
                    >
                      <div className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0'>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className='font-semibold'>{user.username}</p>
                        <p className='text-xs text-muted-foreground'>
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.posts.length > 0 && (
            <div>
              <h4 className='text-xs font-bold text-muted-foreground uppercase p-3 pb-1'>
                Posts
              </h4>
              <ul>
                {results.posts.map((post) => (
                  <li key={post._id}>
                    <Link
                      href={`/post/${post._id}`}
                      className='block p-3 hover:bg-gray-100'
                      onClick={() => setQuery('')}
                    >
                      <p className='font-semibold'>
                        Post by @{post.user.username}
                      </p>
                      <p className='text-sm text-muted-foreground truncate'>
                        {post.content}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
