'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  BrainCircuit,
  Search,
  PenSquare,
  User,
  LogOut,
  Menu,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-white'>
      <div className='container mx-auto flex h-16 items-center'>
        {/* Left Section */}
        <div className='flex items-center gap-6'>
          <Link href='/feed' className='flex items-center gap-2'>
            <BrainCircuit className='h-7 w-7 text-primary' />
            <span className='hidden sm:inline-block font-bold text-lg'>
              Second Brain
            </span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className='flex-1 flex justify-center px-4 lg:px-8'>
          <div className='relative w-full max-w-lg'>
            <Input
              type='search'
              placeholder='Search for ideas, topics, or people...'
              className='pl-10 h-10 bg-gray-100 border-transparent focus:bg-white focus:border-primary'
            />
            <div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none'>
              <Search className='h-5 w-5 text-muted-foreground' />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-3'>
          <Button className='hidden sm:flex items-center gap-2'>
            <PenSquare className='w-5 h-5' />
            <span>Post</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-10 h-10 rounded-full'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg'>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end'>
                <DropdownMenuLabel>
                  <p className='font-bold'>{user.username}</p>
                  <p className='text-xs text-muted-foreground font-normal'>
                    @{user.username}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => router.push(`/profile/${user.username}`)}
                >
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href='/login'>
                <Button variant='ghost'>Login</Button>
              </Link>
              <Link href='/signup'>
                <Button>Sign Up</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu - could be used to toggle sidebars in the future */}
          <Button variant='ghost' size='icon' className='md:hidden'>
            <Menu className='h-6 w-6' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
