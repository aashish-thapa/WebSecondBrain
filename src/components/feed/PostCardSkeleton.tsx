export function PostCardSkeleton() {
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6'>
      <div className='flex items-start gap-4 animate-pulse'>
        <div className='w-11 h-11 rounded-full bg-gray-200 flex-shrink-0'></div>
        <div className='flex-1 space-y-3'>
          <div className='space-y-1'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
            <div className='h-3 bg-gray-200 rounded w-1/6'></div>
          </div>
          <div className='space-y-2'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          </div>
        </div>
      </div>
      <div className='mt-4 pl-12 sm:pl-16 flex justify-between items-center'>
        <div className='flex items-center gap-6'>
          <div className='h-4 bg-gray-200 rounded w-10'></div>
          <div className='h-4 bg-gray-200 rounded w-10'></div>
          <div className='h-4 bg-gray-200 rounded w-6'></div>
        </div>
        <div className='h-6 bg-gray-200 rounded-full w-24'></div>
      </div>
    </div>
  )
}
