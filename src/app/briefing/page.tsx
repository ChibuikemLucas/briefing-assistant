'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Briefing {
    id: number
    filename: string
    summary: string
    date: string
}

export default function BriefingPage() {
    const [briefings, setBriefings] = useState<Briefing[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchBriefings() {
        try {
            const res = await fetch('/api/briefing', { cache: 'no-store' })
            const data = await res.json()
            setBriefings(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBriefings()
    }, [])

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this briefing?')) return

        try {
            const res = await fetch(`/api/briefing?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setBriefings((prev) => prev.filter((b) => b.id !== id))
            } else {
                alert('❌ Failed to delete briefing.')
            }
        } catch (err) {
            console.error('Error deleting briefing:', err)
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-border">
                <h1 className="text-3xl font-bold tracking-wide transition-all">
                    BRIEFINGS OVERVIEW 🧠
                </h1>
                <nav className="text-sm">
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-md border border-border hover:bg-var-card transition-all"
                    >
                        ← Back to Dashboard
                    </Link>
                </nav>
            </header>

            {/* Content Section */}
            <section className="flex-1 p-8">
                <div className="rounded-xl border border-var-border bg-var-card p-8 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 tracking-wide">
                        Mission Briefings
                    </h2>
                    <p className="opacity-80 mb-6">
                        This page displays all uploaded and generated briefings.
                    </p>

                    {loading ? (
                        <div>Loading briefings...</div>
                    ) : briefings.length === 0 ? (
                        <ul className="space-y-3">
                            <li className="p-4 rounded border border-var-border hover:bg-var-muted transition-all">
                                <span className="font-medium">No briefings yet.</span>{' '}
                                <span className="opacity-70 text-sm">Upload one to get started.</span>
                            </li>
                        </ul>
                    ) : (
                        <ul className="space-y-4">
                            {briefings.map((b) => (
                                <li
                                    key={b.id}
                                    className="p-4 rounded border border-var-border hover:bg-var-muted transition-all"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h3 className="font-medium text-lg">{b.filename}</h3>
                                            <p className="text-sm opacity-70">
                                                {new Date(b.date).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="text-red-500 text-sm border border-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <pre className="whitespace-pre-wrap text-sm">{b.summary}</pre>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    )
}
