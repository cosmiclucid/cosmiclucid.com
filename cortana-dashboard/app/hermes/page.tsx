import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HermesPage() {
  return (
    <main className="min-h-dvh p-3 sm:p-5 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-[1800px] flex-col gap-3 sm:min-h-[calc(100dvh-2.5rem)] lg:min-h-[calc(100dvh-3rem)]">
        <header className="glass flex flex-col gap-4 rounded-[24px] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-aurora">
                Protected agent runtime
              </p>
              <h1 className="mt-1 text-xl font-semibold text-white">Hermes Agent OS</h1>
              <p className="mt-1 text-sm text-mist">
                Embedded from the existing same-origin `/agent-os/` route.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <a
              href="/agent-os/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-void shadow-cyan transition hover:bg-aurora"
            >
              <ArrowUpRight className="h-4 w-4" />
              Open directly
            </a>
          </div>
        </header>

        <section className="glass min-h-[720px] flex-1 overflow-hidden rounded-[24px]">
          <iframe
            title="Hermes Agent OS"
            src="/agent-os/"
            className="h-full min-h-[720px] w-full border-0 bg-white"
            allow="clipboard-read; clipboard-write; microphone"
            referrerPolicy="same-origin"
          />
        </section>

        <p className="px-2 text-xs leading-5 text-mist">
          If the embedded view is blocked by the Hermes WebUI response headers, use “Open directly.”
          The existing `/agent-os/` route and its Basic Auth remain unchanged.
        </p>
      </div>
    </main>
  );
}
