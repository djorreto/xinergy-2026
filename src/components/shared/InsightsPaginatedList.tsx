"use client";

import { useState } from "react";
import { insights } from "@/lib/content";
import { InsightCard } from "@/components/shared/InsightCard";

const PER_PAGE = 3;

export function InsightsPaginatedList() {
  const totalPages = Math.ceil(insights.length / PER_PAGE);
  const [page, setPage] = useState(1);

  const start = (page - 1) * PER_PAGE;
  const visible = insights.slice(start, start + PER_PAGE);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:gap-5">
        {visible.map((item) => (
          <InsightCard key={item.slug} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-2"
          aria-label="Paginación de insights"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={page === n ? "page" : undefined}
              className={`min-w-[2.75rem] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                page === n
                  ? "bg-xinergy-orange text-xinergy-charcoal"
                  : "border border-xinergy-charcoal/15 text-xinergy-slate hover:border-xinergy-orange hover:text-xinergy-orange"
              }`}
            >
              Página {n}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
