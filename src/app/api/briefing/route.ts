import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import PDFParser from 'pdf2json'
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
    for (const w of words) freq[w] = (freq[w] || 0) + 1
    return freq
}

// 🧩 Utility: Score sentences based on keyword frequency
function rankSentences(sentences: string[], freq: Record<string, number>) {
    const scores: { sentence: string; score: number }[] = []

    for (const s of sentences) {
        const words = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
        const score = words.reduce((sum, w) => sum + (freq[w] || 0), 0)
        scores.push({ sentence: s, score })
    }

    return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(s => s.sentence)
}

// 🧩 Utility: Extract simple "Action Items" (based on verbs)
function extractActions(sentences: string[]): string[] {
    const actionVerbs = [
        'implement', 'review', 'analyze', 'approve', 'launch', 'update',
        'finalize', 'discuss', 'assign', 'schedule', 'prepare', 'confirm'
    ]

    return sentences
        .filter(s => actionVerbs.some(v => s.toLowerCase().includes(v)))
        .slice(0, 3)
}

// 🧩 Utility: Convert uploaded file to plain text
async function extractTextFromFile(file: any): Promise<string> {
    if (!file) throw new Error('No file provided to extractTextFromFile')
    if (!file.name) throw new Error('Uploaded file is missing a name')

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = path.extname(String(file.name)).toLowerCase()

    try {
        if (ext === '.pdf') {
            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, false);

                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    try {
                        const text = pdfParser.getRawTextContent();
                        resolve(text || '');
                    } catch (err) {
                        reject(err);
                    }
                });

                pdfParser.on('pdfParser_dataError', reject);
                pdfParser.parseBuffer(buffer);
            });
        }

        if (ext === '.doc' || ext === '.docx') {
            const result = await mammoth.extractRawText({ buffer })
            return result.value || ''
        }

        // fallback for txt or unknown file types
        return buffer.toString('utf-8')
    } catch (err) {
        console.error('Error extracting text from file:', err)
        throw err
    }
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

        // Process text
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
        try {
            fs.writeFileSync(briefingsPath, JSON.stringify(existing, null, 2))
        } catch (err) {
            console.error('Failed to write briefings.json', err)
            return NextResponse.json({ error: 'Failed to save briefing' }, { status: 500 })
        }

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
            return NextResponse.json([]) // no briefings yet
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