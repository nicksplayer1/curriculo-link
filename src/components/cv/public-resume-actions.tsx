"use client";

import { useState } from "react";

export default function PublicResumeActions() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
      >
        {copied ? "Link copiado" : "Copiar link"}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Baixar PDF
      </button>
    </div>
  );
}
