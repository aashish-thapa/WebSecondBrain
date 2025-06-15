import PostClient from './PostClient'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  return <PostClient id={id} />
}
