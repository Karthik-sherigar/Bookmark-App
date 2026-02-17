'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export function BookmarkForm({ onBookmarkAdded }: { onBookmarkAdded: () => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('Not authenticated')
        return
      }

      const { error } = await supabase.from('bookmarks').insert({
        title: title.trim(),
        url: url.trim(),
        user_id: user.id,
      })

      if (error) {
        alert('Error adding bookmark: ' + error.message)
      } else {
        setTitle('')
        setUrl('')
        onBookmarkAdded()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Bookmark</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Favorite Blog"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
        >
          {isLoading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  )
}

export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadBookmarks = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading bookmarks:', error)
      } else {
        setBookmarks(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBookmarks()

    const channel = supabase
      .channel(`bookmarks-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          loadBookmarks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    const { error } = await supabase.from('bookmarks').delete().eq('id', id)

    if (error) {
      alert('Error deleting bookmark: ' + error.message)
    } else {
      setBookmarks(bookmarks.filter((b) => b.id !== id))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No bookmarks yet. Add your first one above!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate text-lg">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm truncate block mt-1"
              >
                {bookmark.url}
              </a>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(bookmark.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex-shrink-0 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
