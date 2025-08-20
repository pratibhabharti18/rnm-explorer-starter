import { useEffect, useState } from 'react'

const API_URL = 'https://rickandmortyapi.com/api/character'

export default function App() {
  const [characters, setCharacters] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function getData() {
      setLoading(true)
      setError('')
      const url = new URL(API_URL)
      url.searchParams.set('page', page)
      if (query) url.searchParams.set('name', query)
      if (status) url.searchParams.set('status', status)

      try {
        const res = await fetch(url.toString())
        if (res.status === 404) {
          // No results for this filter
          if (!ignore) {
            setCharacters([])
            setTotalPages(1)
          }
        } else if (!res.ok) {
          throw new Error('Network error')
        } else {
          const data = await res.json()
          if (!ignore) {
            setCharacters(data.results || [])
            setTotalPages(data.info?.pages || 1)
          }
        }
      } catch (err) {
        if (!ignore) setError('Something went wrong. Try again.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    getData()
    return () => { ignore = true }
  }, [page, query, status])

  function resetFilters() {
    setQuery('')
    setStatus('')
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Rick & Morty Explorer</h1>
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Search by name…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              className="px-3 py-2 rounded-xl border w-48 sm:w-64"
            />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1) }}
              className="px-3 py-2 rounded-xl border"
            >
              <option value="">Any status</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl border bg-zinc-100 hover:bg-zinc-200 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-zinc-300 border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && characters.length === 0 && (
          <p className="text-center text-zinc-600">No results. Try different filters.</p>
        )}

        {!loading && !error && characters.length > 0 && (
          <>
            <ul className="grid gap-4 grid-template sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((c) => (
                <li key={c.id} className="rounded-2xl overflow-hidden border bg-white shadow-sm">
                  <img alt={c.name} src={c.image} className="w-full aspect-square object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{c.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 mt-1">{c.species} • {c.gender}</p>
                    <p className="text-xs text-zinc-500 mt-2">Origin: {c.origin?.name}</p>
                    <p className="text-xs text-zinc-500">Location: {c.location?.name}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-lg border disabled:opacity-50"
              >
                ◀ Prev
              </button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 rounded-lg border disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-xs text-zinc-500 py-6">
        Built with React, Vite & Tailwind. Data: rickandmortyapi.com
      </footer>
    </div>
  )
}
