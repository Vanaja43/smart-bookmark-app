
'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-gray-200 py-4 px-6 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔖</span>
          <h1 className="font-bold text-lg">Smart Bookmarks</h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 hidden sm:inline">{user.email}</span>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="text-sm font-medium hover:underline text-gray-700 disabled:opacity-50"
          >
            {signingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </header>
  )
}
