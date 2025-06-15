import { TrendingWidget } from './TrendingWidget'
import { FollowSuggestionsWidget } from './FollowSuggestionsWidget'

export function RightSidebar() {
  return (
    <div className='space-y-6'>
      <TrendingWidget />
      <FollowSuggestionsWidget />
    </div>
  )
}
