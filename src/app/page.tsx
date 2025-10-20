"use client";

import Link from "next/link";
import ThreeScene from "..components/ThreeScene";
import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
        <h1 className="text-3xl font-bold tracking-wide hover:glow transition-all">
          CORTEX BRIEFING
        </h1>
        <nav className="text-sm">
          <Link
            href="/briefing"
            className="px-4 py-2 rounded-md border border-[var(--border)] hover:bg-[var(--card)] transition-all"
          >
            View Briefings →
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col lg:flex-row gap-6 p-8">
        {/* Three.js Scene */}
        <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 tracking-wide">
            Cinematic Visual Grid
          </h2>
          <div className="h-[420px] rounded overflow-hidden">
            <ThreeScene />
          </div>
        </div>

        {/* Upload Form */}
        <div className="w-full lg:w-[420px] rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 tracking-wide">
            Upload Operational Reports
          </h2>
          <UploadForm />
        </div>
      </section>
    </main>
  );
}
