import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import {
  BrainCircuit,
  Menu,
  PenLine,
  Users,
  MessageSquareQuote,
  Zap,
  Quote,
  Brain,
  ShieldCheck,
  Smile,
  Frown,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className='bg-white'>
      <div className='bg-white rounded-2xl overflow-hidden font-sans'>
        {/* Header */}
        <header className='px-4 md:px-10 py-5 flex justify-between items-center border-b sticky top-0 z-50 bg-white/80 backdrop-blur-md'>
          <Link href='#' className='flex items-center gap-2' prefetch={false}>
            <BrainCircuit className='h-6 w-6 text-foreground' />
            <span className='font-bold text-lg'>SayItLoud</span>
          </Link>
          <nav className='hidden md:flex items-center gap-6 text-sm font-medium'>
            <Link
              href='#features'
              className='hover:text-primary transition-colors'
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href='#how-it-works'
              className='hover:text-primary transition-colors'
              prefetch={false}
            >
              How It Works
            </Link>
            <Link
              href='#community'
              className='hover:text-primary transition-colors'
              prefetch={false}
            >
              Community
            </Link>
          </nav>
          <div className='flex items-center gap-4'>
            <Link href='/login'>
              <Button variant='ghost'>Login</Button>
            </Link>
            <Link href='/signup'>
              <Button>Sign Up</Button>
            </Link>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className='px-6 md:px-10 py-20 md:py-28 text-center'>
            <div className='max-w-4xl mx-auto'>
              <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight'>
                Engage, Inquire, Illuminate.
                <br />
                <span className='bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-transparent bg-clip-text'>
                  Your Social Intellect.
                </span>
              </h1>
              <p className='mt-6 max-w-2xl mx-auto text-lg text-muted-foreground'>
                Crafting social experiences that resonate, inspire, and turn
                passing thoughts into profound understanding.
              </p>
              <div className='mt-8 flex gap-4 justify-center'>
                <Link href='/signup'>
                  <Button size='lg'>Get Started</Button>
                </Link>
                <Link href='#features'>
                  <Button size='lg' variant='outline'>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Features Section */}
        <section
          id='features'
          className='px-6 md:px-10 py-12 md:py-20 bg-gray-50/50'
        >
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold'>
                A New Arena for Ideas
              </h2>
              <p className='mt-4 max-w-2xl mx-auto text-lg text-muted-foreground'>
                Our platform is more than a network; it&apos;s a space designed
                for intellectual exploration and growth.
              </p>
            </div>
            <div className='grid md:grid-cols-3 gap-8 text-center'>
              <div className='p-8 bg-white rounded-2xl shadow-lg border'>
                <PenLine className='h-10 w-10 mx-auto text-primary' />
                <h3 className='mt-4 text-xl font-bold'>Share Your Insights</h3>
                <p className='mt-2 text-muted-foreground'>
                  Articulate your thoughts, post your philosophies, and
                  contribute to a growing library of human wisdom.
                </p>
              </div>
              <div className='p-8 bg-white rounded-2xl shadow-lg border'>
                <Users className='h-10 w-10 mx-auto text-primary' />
                <h3 className='mt-4 text-xl font-bold'>Engage with Thinkers</h3>
                <p className='mt-2 text-muted-foreground'>
                  Connect with a global community of philosophers, students, and
                  curious minds. Debate, discuss, and learn.
                </p>
              </div>
              <div className='p-8 bg-white rounded-2xl shadow-lg border'>
                <MessageSquareQuote className='h-10 w-10 mx-auto text-primary' />
                <h3 className='mt-4 text-xl font-bold'>Structured Discourse</h3>
                <p className='mt-2 text-muted-foreground'>
                  Our platform encourages structured, thoughtful conversations,
                  moving beyond fleeting comments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section
          id='ai-features'
          className='px-6 md:px-10 py-12 md:py-20 bg-white'
        >
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold'>
                AI-Powered Analysis
              </h2>
              <p className='mt-4 max-w-2xl mx-auto text-lg text-muted-foreground'>
                Our platform leverages cutting-edge AI to provide deeper
                insights into every conversation.
              </p>
            </div>
            <div className='grid md:grid-cols-3 gap-8 text-center'>
              <div className='p-8 rounded-2xl shadow-lg border animate-fade-in-up transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'>
                <ShieldCheck className='h-10 w-10 mx-auto text-green-500' />
                <h3 className='mt-4 text-xl font-bold'>Fact-Check Analysis</h3>
                <p className='mt-2 text-muted-foreground'>
                  Our AI analyzes posts and provides a stance, indicating if the
                  content is supported, neutral, or opposed by external sources.
                </p>
              </div>
              <div className='p-8 rounded-2xl shadow-lg border animate-fade-in-up transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 delay-150'>
                <Smile className='h-10 w-10 mx-auto text-blue-500' />
                <h3 className='mt-4 text-xl font-bold'>Sentiment Analysis</h3>
                <p className='mt-2 text-muted-foreground'>
                  Understand the emotional tone behind the words. Our AI rates
                  sentiment to foster more empathetic communication.
                </p>
              </div>
              <div className='p-8 rounded-2xl shadow-lg border animate-fade-in-up transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 delay-300'>
                <Frown className='h-10 w-10 mx-auto text-red-500' />
                <h3 className='mt-4 text-xl font-bold'>Toxicity Detection</h3>
                <p className='mt-2 text-muted-foreground'>
                  We automatically flag potentially harmful or toxic comments to
                  maintain a healthy and constructive environment for all users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id='how-it-works' className='px-6 md:px-10 py-12 md:py-20'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold'>
                Start Your Journey in 3 Steps
              </h2>
              <p className='mt-4 max-w-2xl mx-auto text-lg text-muted-foreground'>
                Joining the conversation is simple. Here&apos;s how you can
                begin.
              </p>
            </div>
            <div className='relative'>
              <div
                className='absolute left-1/2 -translate-x-1/2 mt-4 h-[calc(100%-2rem)] w-0.5 bg-gray-200'
                aria-hidden='true'
              ></div>

              <div className='relative space-y-16'>
                <div className='flex items-center'>
                  <div className='w-1/2 pr-8 text-right'>
                    <h3 className='text-2xl font-bold'>
                      1. Create Your Profile
                    </h3>
                    <p className='mt-2 text-muted-foreground'>
                      Sign up and tell the community which philosophical domains
                      interest you the most.
                    </p>
                  </div>
                  <div className='w-1/2 pl-8'></div>
                  <div className='absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center'>
                    <Users className='w-6 h-6 text-primary' />
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='w-1/2 pr-8'></div>
                  <div className='w-1/2 pl-8 text-left'>
                    <h3 className='text-2xl font-bold'>
                      2. Post Your Thoughts
                    </h3>
                    <p className='mt-2 text-muted-foreground'>
                      Share an original idea, a critique of a known philosophy,
                      or a question for the community.
                    </p>
                  </div>
                  <div className='absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center'>
                    <PenLine className='w-6 h-6 text-primary' />
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='w-1/2 pr-8 text-right'>
                    <h3 className='text-2xl font-bold'>3. Engage in Debate</h3>
                    <p className='mt-2 text-muted-foreground'>
                      Comment on posts, participate in threaded discussions, and
                      build upon the ideas of others.
                    </p>
                  </div>
                  <div className='w-1/2 pl-8'></div>
                  <div className='absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center'>
                    <MessageSquareQuote className='w-6 h-6 text-primary' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial/Quote Section */}
        <section
          id='community'
          className='px-6 md:px-10 py-12 md:py-20 bg-gray-50/50'
        >
          <div className='max-w-3xl mx-auto text-center'>
            <Quote className='h-12 w-12 mx-auto text-gray-300' />
            <blockquote className='mt-6 text-2xl md:text-3xl font-medium text-gray-800'>
              &quot;The unexamined life is not worth living. This platform is
              the modern Lyceum for that very examination.&quot;
            </blockquote>
            <footer className='mt-6'>
              <p className='font-bold text-lg'>Aristotle_Fan_42</p>
              <p className='text-muted-foreground'>
                Early Adopter & Community Moderator
              </p>
            </footer>
          </div>
        </section>

        {/* CTA Section */}
        <section className='bg-linear-to-r from-primary via-pink-500 to-orange-400 text-white'>
          <div className='max-w-6xl mx-auto px-6 md:px-10 py-16 text-center'>
            <h2 className='text-3xl font-bold'>Ready to Dive In?</h2>
            <p className='mt-2 text-lg opacity-90'>
              Become a part of the world&apos;s most intellectually vibrant
              community.
            </p>
            <div className='mt-8'>
              <Link href='/signup'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='bg-white text-primary hover:bg-gray-100'
                >
                  Sign Up Now <Zap className='w-4 h-4 ml-2' />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='px-6 md:px-10 py-8 bg-gray-50/50 border-t'>
          <div className='max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Brain className='h-6 w-6 text-foreground' />
              <span className='font-semibold'>Second Brain</span>
            </div>
            <nav className='flex gap-4 text-sm text-muted-foreground'>
              <Link href='#' className='hover:text-primary'>
                About
              </Link>
              <Link href='#' className='hover:text-primary'>
                Privacy
              </Link>
              <Link href='#' className='hover:text-primary'>
                Terms
              </Link>
              <Link href='#' className='hover:text-primary'>
                Contact
              </Link>
            </nav>
            <div className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} Second Brain. All rights
              reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
