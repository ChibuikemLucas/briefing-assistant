'use client'

import Link from "next/link"
import Image from "next/image"
import UploadForm from "../../components/UploadForm"
import { Button } from "../../components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-zinc-950 to-zinc-900 text-zinc-100 overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-10 mt-16 max-w-7xl w-full">
        {/* Hero Image (Top for mobile, right for desktop) */}
        <div className="order-1 lg:order-2 flex-1 relative w-full min-h-80 sm:min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/images/bh7.jpg"
            alt="Briefing Assistant Hero"
            fill
            priority
            className="object-cover object-center opacity-95 hover:opacity-100 transition-opacity duration-700"
          />
        </div>

        {/* Left Text Side */}
        <div className="order-2 lg:order-1 flex-1 text-center lg:text-left px-2 sm:px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Your <span className="text-blue-400">Intelligence Briefing</span> Assistant 🛰️
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Upload, organize, and summarize your operational reports with AI precision.
            Your central command for mission briefings, insights, and summaries — all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link href="/briefing" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
              >
                View Briefings →
              </Button>
            </Link>
            <Link href="#upload" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl border-zinc-600 hover:bg-zinc-800 transition-all"
              >
                Upload Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upload Form Section */}
      <section
        id="upload"
        className="mt-20 w-full max-w-3xl sm:max-w-4xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center tracking-wide">
          Upload Operational Reports
        </h2>
        <UploadForm />
      </section>

      {/* Footer */}
      <footer className="mt-20 text-xs sm:text-sm text-zinc-500 text-center mb-6 px-4">
        © {new Date().getFullYear()} Briefing Assistant · Built with Next.js & Local AI by{" "}
        <span className="text-zinc-300 font-medium">CHIBUIKEM LUCAS</span>
      </footer>
    </main>
  )
}
