import ProfileClient from './ProfileClient'

type PageProps = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  return <ProfileClient username={username} />
}
