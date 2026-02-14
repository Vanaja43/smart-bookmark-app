
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AddBookmark({ userId }: { userId: string }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required')
      return
    }

    try {
      new URL(url)
    } catch {
      setError('Invalid URL (must include http:// or https://)')
      return
    }

    setLoading(true)

    const { error: insertError } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, title: title.trim(), url: url.trim() }])

    if (insertError) {
      setError('Failed to add bookmark')
    } else {
      setTitle('')
      setUrl('')
    }
    setLoading(true)
    // Small delay to prevent double submissions and UI flickering
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <div className="card mb-8">
      <h2 className="text-lg font-bold mb-4">Add Bookmark</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            placeholder="E.g., My Website"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            placeholder="https://..."
            disabled={loading}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-fit self-end"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}
