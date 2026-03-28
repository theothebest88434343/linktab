export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Linktab</span>
        <div className="flex items-center gap-4">
          <a href="/dashboard/analytics" className="text-sm text-gray-500 hover:text-black transition-colors">Analytics</a>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-black transition-colors">Editor</a>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}