'use client'

import { createClient } from '@/lib/supabase/client'

interface Link {
  id: string
  title: string
  url: string
  profile_id: string
}

interface Props {
  links: Link[]
  profileId: string
}

export default function ProfileLinks({ links, profileId }: Props) {
  const supabase = createClient()

  async function handleClick(link: Link) {
    // Log the click
    await supabase.from('link_clicks').insert({
      link_id: link.id,
      profile_id: profileId,
    })
    // Navigate to the URL
    window.open(link.url, '_blank')
  }

  if (links.length === 0) {
    return <p className="text-center text-gray-400 text-sm">No links yet.</p>
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      {links.map(link => (
        <button
          key={link.id}
          onClick={() => handleClick(link)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-5 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all text-center shadow-sm"
        >
          {link.title}
        </button>
      ))}
    </div>
  )
}