
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        router.push('/bookmarks')
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          router.push('/bookmarks')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Smart Bookmark</h1>
      <p className="text-gray-600 mb-8 text-lg">
        A simple, private way to organize your favorite links.
      </p>

      <button
        onClick={signInWithGoogle}
        className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-gray-100 pt-16">
        <div>
          <h3 className="font-bold mb-2">Private</h3>
          <p className="text-gray-500 text-sm">Your bookmarks are yours alone.</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Real-time</h3>
          <p className="text-gray-500 text-sm">Syncs instantly across devices.</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Simple</h3>
          <p className="text-gray-500 text-sm">No clutter, just your links.</p>
        </div>
      </div>
    </main>
  )
}
