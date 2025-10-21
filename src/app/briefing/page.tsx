import Link from "next/link";

export default function BriefingPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
                <h1 className="text-3xl font-bold tracking-wide transition-all">
                    BRIEFINGS OVERVIEW 🧠
                </h1>
                <nav className="text-sm">
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-md border border-[var(--border)] hover:bg-[var(--card)] transition-all"
                    >
                        ← Back to Dashboard
                    </Link>
                </nav>
            </header>

            {/* Content Section */}
            <section className="flex-1 p-8">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 tracking-wide">
                        Mission Briefings
                    </h2>
                    <p className="opacity-80 mb-6">
                        This page will display all uploaded or generated briefings.
                        Soon you’ll see dynamic summaries, insights, and operational reports listed here.
                    </p>

                    {/* Placeholder list */}
                    <ul className="space-y-3">
                        <li className="p-4 rounded border border-[var(--border)] hover:bg-[var(--muted)] transition-all">
                            <span className="font-medium">No briefings yet.</span>{" "}
                            <span className="opacity-70 text-sm">Upload one to get started.</span>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
