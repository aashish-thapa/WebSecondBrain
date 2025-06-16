'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, Compass, Bell, Mail, User, PenSquare } from 'lucide-react'
import Image from 'next/image'

export function LeftSidebar() {
  const { user, isLoading: loading } = useAuth()

  const navItems = [
    { href: '/feed', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    {
      href: '#',
      label: 'Messages',
      icon: Mail,
      onClick: () => alert('Feature coming soon!'),
    },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  if (loading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-full bg-gray-200'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-24'></div>
              <div className='h-3 bg-gray-200 rounded w-16'></div>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 h-48'></div>
        <div className='h-12 bg-gray-200 rounded-lg w-full'></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80'>
        <p className='text-center font-medium'>Welcome to SayItLoud</p>
        <p className='mt-2 text-sm text-center text-muted-foreground'>
          Log in to join the discussion and share your thoughts.
        </p>
        <Link href='/login' className='mt-4 block'>
          <Button className='w-full'>Login</Button>
        </Link>
      </div>
    )
  }

  navItems[4].href = `/profile/${user.username}`

  return (
    <div className='flex flex-col gap-6'>
      <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80'>
        <Link href={`/profile/${user.username}`} className='block group'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0 relative overflow-hidden'>
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.username}
                  layout='fill'
                  objectFit='cover'
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className='font-bold group-hover:underline'>{user.username}</p>
              <p className='text-sm text-muted-foreground'>@{user.username}</p>
            </div>
          </div>
        </Link>
      </div>

      <nav className='bg-white p-3 rounded-2xl shadow-sm border border-gray-200/80'>
        <ul className='space-y-1'>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} onClick={item.onClick}>
                <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-foreground/80 hover:text-primary'>
                  <item.icon className='w-6 h-6' />
                  <span>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Button size='lg' className='w-full py-3 text-lg font-bold'>
        <PenSquare className='w-5 h-5 mr-3' />
        Post
      </Button>
    </div>
  )
}
