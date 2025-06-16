'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/api'
import { User } from '@/types'

interface EditProfileModalProps {
  children: React.ReactNode
  onProfileUpdate: (updatedUser: User) => void
}

export function EditProfileModal({
  children,
  onProfileUpdate,
}: EditProfileModalProps) {
  const { user, setUser } = useAuth()
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(
    user?.profilePicture || null
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('profilePicture', selectedFile)

      const updatedUser = await updateUserProfile(formData)

      // Update auth context
      setUser(updatedUser)
      onProfileUpdate(updatedUser)

      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      // Handle error display
    } finally {
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    if (user) {
      setPreview(user.profilePicture || null)
    }
  }, [user])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='flex flex-col items-center gap-4'>
              <div className='w-32 h-32 rounded-full bg-gray-200 relative overflow-hidden'>
                {preview ? (
                  <Image
                    src={preview}
                    alt='Profile preview'
                    layout='fill'
                    objectFit='cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-500'>
                    No image
                  </div>
                )}
              </div>
              <Label
                htmlFor='picture'
                className='cursor-pointer text-primary hover:underline'
              >
                Change profile photo
              </Label>
              <Input
                id='picture'
                type='file'
                className='hidden'
                onChange={handleFileChange}
                accept='image/*'
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
