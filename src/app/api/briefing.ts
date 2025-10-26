import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export const dynamic = 'force-dynamic'

// Utility: Clean and split text into sentences
function getSentences(text: string): string[] {
    return text
        .replace(/\r?\n|\r/g, ' ')
        .match(/[^.!?]+[.!?]/g)
        ?.map(s => s.trim()) || []
}

// Utility: Count word frequency
function getWordFrequency(text: string): Record<string, number> {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    const freq: Record<string, number> = {}
    for (const w of words) freq[w] = (freq[w] || 0) + 1
    return freq
}

// Utility: Score sentences based on keyword frequency
function rankSentences(sentences: string[], freq: Record<string, number>) {
    const scores: { sentence: string; score: number }[] = []

    for (const s of sentences) {
        const words = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
        const score = words.reduce((sum, w) => sum + (freq[w] || 0), 0)
        scores.push({ sentence: s, score })
    }

    return scores.sort((a, b) => b.score - a.score).slice(0, 5).map(s => s.sentence)
}

// Utility: Extract simple “Action Items” (based on verbs)
function extractActions(sentences: string[]): string[] {
    const actionVerbs = [
        'implement', 'review', 'analyze', 'approve', 'launch', 'update',
        'finalize', 'discuss', 'assign', 'schedule', 'prepare', 'confirm'
    ]

    return sentences
        .filter(s => actionVerbs.some(v => s.toLowerCase().includes(v)))
        .slice(0, 3)
}

// Utility: Convert uploaded file to plain text
async function extractTextFromFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = path.extname(file.name).toLowerCase()

    if (ext === '.pdf') {
        const data = await pdfParse(buffer)
        return data.text
    }

    if (ext === '.doc' || ext === '.docx') {
        const result = await mammoth.extractRawText({ buffer })
        return result.value
    }

    // fallback for txt or unknown file types
    return buffer.toString('utf-8')
}

// Main handler
export async function POST(req: Request) {
    try {
        const data = await req.formData()
        const file = data.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const text = await extractTextFromFile(file)

        // Clean and process
        const sentences = getSentences(text)
        const freq = getWordFrequency(text)
        const keySentences = rankSentences(sentences, freq)
        const actions = extractActions(sentences)

        const summary = `
📄 **Meeting Briefing**
${keySentences.join(' ')}

🗒 **Action Points**
${actions.length > 0 ? actions.map(a => `- ${a}`).join('\n') : '- No clear action items detected'}

📆 Generated on: ${new Date().toLocaleString()}
    `.trim()

        // Save to local JSON file
        const briefingsPath = path.join(process.cwd(), 'data', 'briefings.json')
        const existing = fs.existsSync(briefingsPath)
            ? JSON.parse(fs.readFileSync(briefingsPath, 'utf-8'))
            : []

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
