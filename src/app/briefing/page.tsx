'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

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
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p>🗑️ Are you sure you want to delete this briefing?</p>
                <div className="flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                        onClick={async () => {
                            toast.dismiss(t.id)
                            try {
                                const res = await fetch(`/api/briefing?id=${id}`, { method: 'DELETE' })
                                if (res.ok) {
                                    setBriefings((prev) => prev.filter((b) => b.id !== id))
                                    toast.success('Briefing deleted ✅')
                                } else {
                                    toast.error('Failed to delete briefing ❌')
                                }
                            } catch (err) {
                                console.error(err)
                                toast.error('Error deleting briefing ❌')
                            }
                        }}
                    >
                        Yes, delete
                    </button>
                    <button
                        className="px-3 py-1 rounded-md text-sm border border-border hover:bg-muted"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 8000 })
    }

    function cleanSummary(summary: string): string {
        return summary
            .replace(/[*•\-–]+/g, '') // remove bullets, asterisks, and dashes
            .replace(/\s{2,}/g, ' ')  // remove double spaces
            .trim()
    }

    return (
        <main className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 text-zinc-100 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Briefings Overview 🧠
                </h1>
                <nav className="text-sm">
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-md border border-zinc-700 hover:bg-zinc-800 transition-all"
                    >
                        ← Back to Dashboard
                    </Link>
                </nav>
            </header>

            {/* Content */}
            <section className="flex-1 p-8">
                <div className="max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 tracking-wide text-blue-400">
                        Mission Briefings
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        View and manage your uploaded intelligence summaries below.
                    </p>

                    {loading ? (
                        <div className="text-zinc-500">Loading briefings...</div>
                    ) : briefings.length === 0 ? (
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
                            <p className="font-medium text-zinc-300">No briefings yet.</p>
                            <p className="text-sm text-zinc-500">Upload one to get started.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {briefings.map((b) => (
                                <li
                                    key={b.id}
                                    className="p-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-all shadow-sm"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2">
                                        <div>
                                            <h3 className="font-semibold text-lg text-zinc-100">
                                                {b.filename}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                {new Date(b.date).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="text-red-400 text-sm border border-red-400 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">
                                        {cleanSummary(b.summary)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto text-center text-sm text-zinc-600 py-6">
                © {new Date().getFullYear()} Briefing Assistant · Built by CHIBUIKEM LUCAS
            </footer>
        </main>
    )
}
