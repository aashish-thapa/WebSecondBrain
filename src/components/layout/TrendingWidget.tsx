import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

const trends = [
  { topic: 'Stoicism', posts: '15.2k posts' },
  { topic: 'Existentialism', posts: '12.8k posts' },
  { topic: '#Nietzsche', posts: '9.1k posts' },
  { topic: "Plato's Republic", posts: '5.5k posts' },
  { topic: 'Virtue Ethics', posts: '3.2k posts' },
]

export function TrendingWidget() {
  return (
    <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80'>
      <div className='flex items-center gap-2 mb-4'>
        <TrendingUp className='w-6 h-6 text-primary' />
        <h3 className='font-bold text-lg'>Trending Debates</h3>
      </div>
      <ul className='space-y-3'>
        {trends.map((trend) => (
          <li key={trend.topic}>
            <Link
              href={`/search?q=${encodeURIComponent(trend.topic)}`}
              className='group block p-2 -m-2 rounded-lg hover:bg-gray-100/80 transition-colors'
            >
              <p className='font-bold'>{trend.topic}</p>
              <p className='text-sm text-muted-foreground'>{trend.posts}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
