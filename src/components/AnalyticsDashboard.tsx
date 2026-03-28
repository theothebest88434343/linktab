'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LinkStat {
  id: string
  title: string
  url: string
  clicks: number
}

interface ClickByDay {
  date: string
  clicks: number
}

export default function AnalyticsDashboard() {
  const [linkStats, setLinkStats] = useState<LinkStat[]>([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [recentClicks, setRecentClicks] = useState<ClickByDay[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) return

      // Get clicks per link
      const { data: links } = await supabase
        .from('links')
        .select('id, title, url')
        .eq('profile_id', profile.id)

      if (links) {
        const statsPromises = links.map(async (link) => {
          const { count } = await supabase
            .from('link_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('link_id', link.id)

          return { ...link, clicks: count || 0 }
        })

        const stats = await Promise.all(statsPromises)
        stats.sort((a, b) => b.clicks - a.clicks)
        setLinkStats(stats)
        setTotalClicks(stats.reduce((sum, s) => sum + s.clicks, 0))
      }

      // Get clicks by day for last 7 days
      const { data: clicks } = await supabase
        .from('link_clicks')
        .select('clicked_at')
        .eq('profile_id', profile.id)
        .gte('clicked_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      if (clicks) {
        const byDay: Record<string, number> = {}
        for (let i = 6; i >= 0; i--) {
          const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          byDay[key] = 0
        }
        clicks.forEach(c => {
          const key = new Date(c.clicked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          if (key in byDay) byDay[key]++
        })
        setRecentClicks(Object.entries(byDay).map(([date, clicks]) => ({ date, clicks })))
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Loading analytics...</p>
    </div>
  )

  const maxClicks = Math.max(...recentClicks.map(d => d.clicks), 1)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Last 7 days of activity</p>
      </div>

      {/* Total clicks card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-sm text-gray-500 mb-1">Total clicks</p>
        <p className="text-4xl font-bold text-gray-900">{totalClicks}</p>
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Clicks per day</p>
        <div className="flex items-end gap-2 h-32">
          {recentClicks.map(({ date, clicks }) => (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{clicks > 0 ? clicks : ''}</span>
              <div
                className="w-full bg-black rounded-t-sm transition-all"
                style={{ height: `${(clicks / maxClicks) * 100}%`, minHeight: clicks > 0 ? '4px' : '2px', opacity: clicks > 0 ? 1 : 0.1 }}
              />
              <span className="text-xs text-gray-400 truncate w-full text-center">{date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per link stats */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Clicks per link</p>
        {linkStats.length === 0 && (
          <p className="text-sm text-gray-400">No links yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {linkStats.map(link => (
            <div key={link.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                <p className="text-xs text-gray-400 truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-black h-1.5 rounded-full"
                    style={{ width: `${totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-6 text-right">{link.clicks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}