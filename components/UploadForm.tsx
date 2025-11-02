'use client'

import React, { useState } from 'react'

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<string>('')

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) {
            setStatus('⚠️ Please select a file before uploading.')
            return
        }

        try {
            const fd = new FormData()
            fd.append('file', file)

            setStatus('📤 Uploading and summarizing...')

            // ✅ Make sure this path matches your API route (src/app/api/briefing/route.ts)
            const res = await fetch('/api/briefing', {
                method: 'POST',
                body: fd,
            })

            if (!res.ok) {
                const errorText = await res.text()
                console.error('Upload failed:', errorText)
                setStatus('❌ Upload failed. Please try again.')
                return
            }

            const data = await res.json()
            setStatus(`✅ Successfully summarized: ${data.filename}`)
            setFile(null)
        } catch (error) {
            console.error('Error uploading file:', error)
            setStatus('❌ An unexpected error occurred.')
        }
    }

    return (
        <form
            onSubmit={submit}
            className="flex flex-col gap-4 items-center sm:items-start w-full"
        >
            <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full sm:w-auto border border-zinc-700 bg-zinc-900/50 text-zinc-100 px-4 py-2 rounded-md cursor-pointer hover:border-zinc-500 focus:outline-none"
            />

            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
                Upload & Summarize
            </button>

            {status && (
                <div className="text-sm text-center sm:text-left text-zinc-400 mt-2">
                    {status}
                </div>
            )}
        </form>
    )
}
