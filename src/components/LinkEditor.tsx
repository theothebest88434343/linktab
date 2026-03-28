'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Link {
  id: string
  title: string
  url: string
  position: number
  is_active: boolean
}

interface Props {
  profile: { id: string; username: string; display_name: string; bio: string }
  links: Link[]
}

export default function LinkEditor({ profile, links: initialLinks }: Props) {
  const [links, setLinks] = useState<Link[]>(initialLinks.sort((a, b) => a.position - b.position))
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function addLink() {
    if (!title || !url) return
    setLoading(true)

    const { data, error } = await supabase.from('links').insert({
      profile_id: profile.id,
      title,
      url: url.startsWith('http') ? url : `https://${url}`,
      position: links.length,
    }).select().single()

    if (!error && data) {
      setLinks([...links, data])
      setTitle('')
      setUrl('')
      setAdding(false)
    }
    setLoading(false)
  }

  async function deleteLink(id: string) {
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter(l => l.id !== id))
  }

  async function toggleLink(id: string, is_active: boolean) {
    await supabase.from('links').update({ is_active: !is_active }).eq('id', id)
    setLinks(links.map(l => l.id === id ? { ...l, is_active: !is_active } : l))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Links list */}
      {links.map(link => (
        <div key={link.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{link.title}</p>
            <p className="text-xs text-gray-400 truncate">{link.url}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLink(link.id, link.is_active)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                link.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {link.is_active ? 'Live' : 'Hidden'}
            </button>
            <button
              onClick={() => deleteLink(link.id)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add link form */}
      {adding ? (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title (e.g. My Portfolio)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            placeholder="URL (e.g. https://mysite.com)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <div className="flex gap-2">
            <button
              onClick={addLink}
              disabled={loading}
              className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add link'}
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-400 hover:border-black hover:text-black transition-colors"
        >
          + Add a link
        </button>
      )}
    </div>
  )
}