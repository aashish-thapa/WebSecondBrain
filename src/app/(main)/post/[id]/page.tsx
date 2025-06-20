import PostClient from './PostClient'
import { getPostById } from '@/lib/api'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const post = await getPostById(id)
    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    const title = `Post by ${post.user.username}`
    const description = post.content.substring(0, 160)

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: post.image
          ? [
              {
                url: post.image,
                alt: 'Post image',
              },
            ]
          : [],
      },
      twitter: {
        title,
        description,
        images: post.image ? [post.image] : [],
      },
    }
  } catch (error) {
    console.error('Failed to generate metadata for post:', error)
    return {
      title: 'Error',
      description: 'Could not load post details.',
    }
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  return <PostClient id={id} />
}
