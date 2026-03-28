import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProfileLinks from '@/components/ProfileLinks'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, links(*), themes(*)')
    .eq('username', username.toLowerCase())
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const links = (profile.links || [])
    .filter((l: any) => l.is_active)
    .sort((a: any, b: any) => a.position - b.position)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold mb-4">
          {(profile.display_name?.[0] || username[0]).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{profile.display_name || username}</h1>
        {profile.bio && (
          <p className="text-gray-500 text-sm mt-1 text-center max-w-xs">{profile.bio}</p>
        )}
      </div>

      <ProfileLinks links={links} profileId={profile.id} />

      <p className="mt-12 text-xs text-gray-300">Made with Linktab</p>
    </div>
  )
}