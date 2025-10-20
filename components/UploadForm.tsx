'use client'
import React, { useState } from 'react'

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState('')

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return
        const fd = new FormData()
        fd.append('file', file)

        setStatus('Uploading...')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) setStatus('Uploaded — brief will be generated')
        else setStatus('Upload failed')
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <input type="file" accept=".pdf,.csv,.json,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button className="px-4 py-2 bg-indigo-600 rounded">Upload</button>
            <div>{status}</div>
        </form>
    )
}
