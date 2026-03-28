import { createClient } from '@/lib/supabase/server'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export default async function AnalyticsPage() {
  return <AnalyticsDashboard />
}