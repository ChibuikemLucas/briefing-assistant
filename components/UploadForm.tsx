'use client'

import React, { useState } from 'react'

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState('')

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return setStatus('No file selected.')

        const fd = new FormData()
        fd.append('file', file)

        setStatus('Uploading...')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })

        if (res.ok) {
            setStatus('✅ Uploaded — Briefing will be summarized soon')
            setFile(null)
        } else {
            setStatus('❌ Upload failed. Try again.')
        }
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            <input
                type="file"
                accept=".pdf,.csv,.json,.txt"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="p-2 border border-[var(--border)] rounded bg-[var(--card)]"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-all"
            >
                Upload
            </button>
            {status && <div className="text-sm mt-1">{status}</div>}
        </form>
    )
}
