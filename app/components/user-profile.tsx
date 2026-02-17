'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function UserProfile() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (isLoading) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {user?.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <p className="font-semibold text-gray-800">
            {user?.user_metadata?.full_name || user?.email}
          </p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium"
      >
        Logout
      </button>
    </div>
  )
}
