export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='text-center'>
        <h1 className='text-5xl font-bold tracking-tighter bg-linear-to-r from-primary via-accent to-secondary text-transparent bg-clip-text'>
          Second Brain
        </h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          A place for philosophers and thinkers to share and connect.
        </p>
      </div>
    </main>
  )
}
