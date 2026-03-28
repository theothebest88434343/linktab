'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LinkEditor from './LinkEditor'
import { useRouter } from 'next/navigation'

export default function LinkEditorWrapper() {
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, links(*)')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        router.push('/login')
        return
      }

      setProfile(profile)
      setLinks(profile.links || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Linktab</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your page: <a href={`/${profile.username}`} target="_blank" className="text-black font-medium hover:underline">linktab.app/{profile.username}</a>
        </p>
      </div>
      <LinkEditor profile={profile} links={links} />
    </div>
  )
}