import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import * as pdf from 'pdf-parse'
import mammoth from 'mammoth'

export const dynamic = 'force-dynamic'

// 🧩 Utility: Clean and split text into sentences
function getSentences(text: string): string[] {
    return text
        .replace(/\r?\n|\r/g, ' ')
        .match(/[^.!?]+[.!?]/g)
        ?.map(s => s.trim()) || []
}

// 🧩 Utility: Count word frequency
function getWordFrequency(text: string): Record<string, number> {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    const freq: Record<string, number> = {}
    for (const w of words) {
        freq[w] = (freq[w] || 0) + 1
    }
    return freq
}

// 🧩 Utility: Score sentences based on keyword frequency
function rankSentences(sentences: string[], freq: Record<string, number>) {
    const scores = sentences.map(s => {
        const words = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
        const score = words.reduce((sum, w) => sum + (freq[w] || 0), 0)
        return { sentence: s, score }
    })
    return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(s => s.sentence)
}

// 🧩 Utility: Smarter Action Item Extraction
function extractActions(sentences: string[]): string[] {
    const actionVerbs = [
        'implement', 'review', 'analyze', 'approve', 'launch', 'update',
        'finalize', 'discuss', 'assign', 'schedule', 'prepare', 'confirm',
        'plan', 'create', 'deliver', 'reallocate', 'design', 'develop', 'submit'
    ]

    const fullText = sentences.join(' ')
    const match = fullText.match(/action\s*items?[:\-]?\s*(.*)/i)
    if (match && match[1]) {
        return match[1]
            .split(/[-•\n]+/)
            .map(item => item.trim())
            .filter(item => item.length > 5)
    }
    return sentences
        .filter(s => actionVerbs.some(v => s.toLowerCase().includes(v)))
        .slice(0, 5)
}

// 🧩 Utility: Highlight names in text
function highlightNames(text: string): string {
    const names = ['Grace', 'David', 'Ibrahim', 'Chioma', 'Lucas']
    let highlighted = text
    for (const name of names) {
        const regex = new RegExp(`\\b${name}\\b`, 'gi')
        highlighted = highlighted.replace(regex, `**${name}**`)
    }
    return highlighted
}

// 🧩 Utility: Convert uploaded file to plain text using pdf-parse
async function extractTextFromFile(file: any): Promise<string> {
    if (!file) throw new Error('No file provided')
    if (!file.name) throw new Error('Uploaded file is missing a name')

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = path.extname(String(file.name)).toLowerCase()

    if (ext === '.pdf') {
        const data = await (pdf as any)(buffer)
        return data.text || ''
    }
    if (ext === '.doc' || ext === '.docx') {
        const result = await mammoth.extractRawText({ buffer })
        return result.value || ''
    }
    return buffer.toString('utf-8')
}

// 🧩 POST: Upload and summarize briefing document
export async function POST(req: Request) {
    try {
        const data = await req.formData()
        const file = data.get('file') as any
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const text = await extractTextFromFile(file)
        const sentences = getSentences(text)
        const freq = getWordFrequency(text)
        const keySentences = rankSentences(sentences, freq)
        const actions = extractActions(sentences)

        const summary = highlightNames(`
📄 **Meeting Briefing**
${keySentences.join(' ')}

🗒 **Action Points**
${actions.length > 0
                ? actions.map(a => `- ${a.replace(/^[\\-\\s]+/, '')}`).join('\n')
                : '- No clear action items detected'}

📆 Generated on: ${new Date().toLocaleString()}
        `.trim())

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data')
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

        const briefingsPath = path.join(dataDir, 'briefings.json')
        let existing: any[] = []
        if (fs.existsSync(briefingsPath)) {
            try {
                existing = JSON.parse(fs.readFileSync(briefingsPath, 'utf-8'))
                if (!Array.isArray(existing)) existing = []
            } catch (err) {
                console.error('Failed to parse existing briefings.json, resetting to []', err)
                existing = []
            }
        }

        const newBriefing = {
            id: Date.now(),
            filename: file.name,
            summary,
            date: new Date().toISOString(),
        }

        existing.push(newBriefing)
        fs.writeFileSync(briefingsPath, JSON.stringify(existing, null, 2))

        return NextResponse.json(newBriefing)
    } catch (error) {
        console.error('Error generating briefing:', error)
        return NextResponse.json(
            { error: 'Failed to process file' },
            { status: 500 }
        )
    }
}

// 🧩 GET: Fetch all stored briefings
export async function GET() {
    try {
        const briefingsPath = path.join(process.cwd(), 'data', 'briefings.json')
        if (!fs.existsSync(briefingsPath)) {
            return NextResponse.json([])
        }
        const data = JSON.parse(fs.readFileSync(briefingsPath, 'utf-8'))
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error reading briefings:', error)
        return NextResponse.json(
            { error: 'Failed to load briefings' },
            { status: 500 }
        )
    }
}


// 🧩DELETE

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = Number(searchParams.get('id'))

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        const briefingsPath = path.join(process.cwd(), 'data', 'briefings.json')
        if (!fs.existsSync(briefingsPath)) {
            return NextResponse.json({ error: 'No briefings file found' }, { status: 404 })
        }

        const data = JSON.parse(fs.readFileSync(briefingsPath, 'utf-8'))
        const updated = data.filter((b: any) => b.id !== id)
        fs.writeFileSync(briefingsPath, JSON.stringify(updated, null, 2))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting briefing:', error)
        return NextResponse.json({ error: 'Failed to delete briefing' }, { status: 500 })
    }
}
