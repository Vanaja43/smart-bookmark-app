
'use client'

import { useEffect, useState } from 'react'
import { createClient, Bookmark } from '@/lib/supabase'
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!error && mounted) setBookmarks(data || [])
      if (mounted) setLoading(false)
    }

    fetchBookmarks()

    const channel = supabase
      .channel('public:bookmarks')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Bookmark>) => {
          if (mounted) setBookmarks((current) => [payload.new as Bookmark, ...current])
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Bookmark>) => {
          if (mounted) {
            setBookmarks((current) => current.filter(b => b.id !== (payload.old as Bookmark).id))
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [userId, supabase])

  const handleDelete = async (id: string) => {
    // Optimistic delete
    setBookmarks(current => current.filter(b => b.id !== id))
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) {
      alert('Failed to delete bookmark')
      // Refetch on error
      const { data } = await supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (data) setBookmarks(data)
    }
  }

  if (loading) return <div className="py-8 text-gray-500">Loading bookmarks...</div>

  if (bookmarks.length === 0) {
    return <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">No bookmarks saved.</div>
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="card flex items-center justify-between group">
          <div className="flex-1 min-w-0 pr-4">
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:underline block truncate"
            >
              {bookmark.title}
            </a>
            <p className="text-xs text-gray-400 truncate mt-1">{bookmark.url}</p>
          </div>
          <button
            onClick={() => handleDelete(bookmark.id)}
            className="text-xs text-red-500 hover:font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
