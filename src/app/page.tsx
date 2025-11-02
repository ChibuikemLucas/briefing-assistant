'use client'

import Link from "next/link"
import Image from "next/image"
import UploadForm from "../../components/UploadForm"
import { Button } from "../../components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-10 mt-16 max-w-6xl w-full">
        {/* Left Text Side */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Your <span className="text-blue-400">Intelligence Briefing</span> Assistant 🛰️
          </h1>

          <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
            Upload, organize, and summarize your operational reports with AI precision.
            Your central command for mission briefings, insights, and summaries — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/briefing">
              <Button
                size="lg"
                className="px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
              >
                View Briefings →
              </Button>
            </Link>
            <Link href="#upload">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-2xl border-zinc-600 hover:bg-zinc-800 transition-all"
              >
                Upload Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="flex-1 relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/images/bh7.jpg"
            alt="Briefing Assistant Hero"
            fill
            priority
            className="object-cover object-center opacity-90 hover:opacity-100 transition-opacity duration-700"
          />
        </div>
      </section>

      {/* Upload Form Section */}
      <section
        id="upload"
        className="mt-20 w-full max-w-4xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center tracking-wide">
          Upload Operational Reports
        </h2>
        <UploadForm />
      </section>

      {/* Footer */}
      <footer className="mt-20 text-sm text-zinc-500 text-center mb-6">
        © {new Date().getFullYear()} Briefing Assistant · Built with Next.js & Local AI by CHIBUIKEM LUCAS
      </footer>
    </main>
  )
}
