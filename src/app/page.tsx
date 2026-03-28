import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-bold text-lg">Linktab</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-black transition-colors">Sign in</Link>
          <Link href="/signup" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          ✦ Free forever
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-2xl mb-6">
          One link for everything you create
        </h1>
        <p className="text-lg text-gray-500 max-w-md mb-10">
          Add your links, share one URL, and see exactly what people click. Simple as that.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/signup" className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Create your Linktab
          </Link>
          <Link href="/sir" className="text-sm text-gray-500 hover:text-black transition-colors">
            See an example →
          </Link>
        </div>

        {/* Mock profile preview */}
        <div className="mt-20 bg-gray-50 border border-gray-100 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold">T</div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Theo</p>
              <p className="text-sm text-gray-400">linktab.app/theo</p>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              {['GitHub', 'Portfolio', 'LinkedIn', 'Resume'].map(label => (
                <div key={label} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-5 text-sm font-medium text-gray-900 text-center shadow-sm">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-gray-100 py-20 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'One link', desc: 'Share a single URL that holds all your links in one place.' },
            { title: 'Click analytics', desc: 'See exactly how many times each link gets clicked.' },
            { title: 'Custom themes', desc: 'Make your page look the way you want it to.' },
          ].map(f => (
            <div key={f.title} className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">{f.title}</p>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">Linktab</span>
        <p className="text-xs text-gray-400">© 2026 Linktab</p>
      </footer>
    </div>
  )
}