'use client'

import { Navbar } from '@/components/layout/Navbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import * as React from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  React.useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const BASE_URL = API_URL.replace('/api', '')

    const keepServerAwake = () => {
      fetch(BASE_URL)
        .then((res) => {
          if (res.ok) {
            console.log('Server pinged successfully.')
          } else {
            console.error('Failed to ping server.')
          }
        })
        .catch((err) => console.error('Error pinging server:', err))
    }

    // Ping immediately on load
    keepServerAwake()

    // And then every 10 minutes
    const intervalId = setInterval(keepServerAwake, 10 * 60 * 1000)

    // Clear interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-8'>
        <aside className='hidden md:block md:col-span-3 sticky top-24'>
          <LeftSidebar />
        </aside>
        <main className='col-span-12 md:col-span-8 lg:col-span-6'>
          {children}
        </main>
        <aside className='hidden lg:block lg:col-span-3 sticky top-24'>
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}
