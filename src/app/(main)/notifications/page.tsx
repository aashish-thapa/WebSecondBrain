'use client'

import * as React from 'react'
import { getNotifications, markNotificationAsRead } from '@/lib/api'
import { Notification as NotificationType } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'

function NotificationIcon({ type }: { type: NotificationType['type'] }) {
  if (type === 'like')
    return <Heart className='w-5 h-5 text-red-500 fill-current' />
  if (type === 'comment')
    return <MessageCircle className='w-5 h-5 text-blue-500' />
  if (type === 'follow') return <UserPlus className='w-5 h-5 text-green-500' />
  return null
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationType[]>(
    []
  )
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadNotifications() {
      setIsLoading(true)
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
    try {
      await markNotificationAsRead(id)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      // Optionally revert UI on error
    }
  }

  const NotificationLink = ({
    notification,
    children,
  }: {
    notification: NotificationType
    children: React.ReactNode
  }) => {
    const href =
      notification.type === 'follow'
        ? `/profile/${notification.initiator.username}`
        : `/post/${notification.post?._id}`

    return <Link href={href}>{children}</Link>
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Notifications</h1>
      <div className='bg-white rounded-2xl border'>
        {isLoading ? (
          <p className='p-6 text-center text-muted-foreground'>Loading...</p>
        ) : notifications.length === 0 ? (
          <div className='p-8 text-center'>
            <Bell className='w-16 h-16 mx-auto text-gray-300' />
            <h3 className='mt-4 text-xl font-bold'>No notifications yet</h3>
            <p className='mt-2 text-muted-foreground'>
              Likes, comments, and new followers will appear here.
            </p>
          </div>
        ) : (
          <ul className='divide-y'>
            {notifications.map((n) => (
              <li key={n._id}>
                <NotificationLink notification={n}>
                  <div
                    className={cn(
                      'p-4 flex items-start gap-4 hover:bg-gray-50',
                      !n.read && 'bg-primary/5'
                    )}
                    onClick={() => !n.read && handleMarkAsRead(n._id)}
                  >
                    <div className='mt-1'>
                      <NotificationIcon type={n.type} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm'>
                        <span className='font-bold'>
                          {n.initiator.username}
                        </span>{' '}
                        {n.message}
                      </p>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!n.read && (
                      <div className='w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0'></div>
                    )}
                  </div>
                </NotificationLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
