'use client'

import * as React from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { getTrendingTopics } from '@/lib/api'

interface Trend {
  topic: string
  count: number
}

export function TrendingWidget() {
  const [trends, setTrends] = React.useState<Trend[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadTrends() {
      try {
        const trendingData = await getTrendingTopics()
        setTrends(trendingData.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch trending topics:', error)
        // Optionally, set an error state to show in the UI
      } finally {
        setIsLoading(false)
      }
    }
    loadTrends()
  }, [])

  return (
    <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80'>
      <div className='flex items-center gap-2 mb-4'>
        <TrendingUp className='w-6 h-6 text-primary' />
        <h3 className='font-bold text-lg'>Trending Debates</h3>
      </div>
      {isLoading ? (
        <div className='space-y-3 animate-pulse'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='p-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-1'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      ) : (
        <ul className='space-y-3'>
          {trends.map((trend) => (
            <li key={trend.topic}>
              <Link
                href={`/search?q=${encodeURIComponent(trend.topic)}`}
                className='group block p-2 -m-2 rounded-lg hover:bg-gray-100/80 transition-colors'
              >
                <p className='font-bold'>#{trend.topic}</p>
                <p className='text-sm text-muted-foreground'>
                  {trend.count} posts
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
