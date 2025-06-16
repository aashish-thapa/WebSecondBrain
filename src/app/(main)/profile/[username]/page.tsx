import { getUserById, searchUsers } from '@/lib/api'
import ProfileClient from './ProfileClient'
import { Metadata } from 'next'

type Props = {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params
  let user = null

  try {
    const users = await searchUsers(username)
    if (users.length > 0) {
      user = await getUserById(users[0]._id)
    }
  } catch (error) {
    console.error('Failed to generate metadata for profile:', error)
    return {
      title: 'User Not Found',
      description: 'The profile you are looking for could not be found.',
    }
  }

  if (!user) {
    return {
      title: 'User Not Found',
      description: 'The profile you are looking for could not be found.',
    }
  }

  const title = `${user.username}'s Profile`
  const description = `View the profile and posts of ${user.username} on SayItLoud. Connect and share your thoughts.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: user.profilePicture || '/default-avatar.png',
          width: 128,
          height: 128,
          alt: `${user.username}'s profile picture`,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [user.profilePicture || '/default-avatar.png'],
    },
  }
}

export default function ProfilePage({ params }: Props) {
  return <ProfileClient username={params.username} />
}
