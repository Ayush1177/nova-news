"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/TiltCard";

export type NewsCard = {
  id: string;
  title: string;
  url: string;
  section: string;
  publishedAt: string;
  summary: string | null;
  image: string | null;
  byline: string | null;
  source: "The Guardian";
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function NewsGrid({ items }: { items: NewsCard[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.25) }}
        >
          <TiltCard className="p-5">
            <a href={item.url} target="_blank" rel="noreferrer" className="block">
              <div className="flex items-start gap-4">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-24 rounded-xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="h-16 w-24 rounded-xl border border-white/10 bg-white/5" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-xs text-white/60">
                    <span>{item.section}</span>
                    <span>{timeAgo(item.publishedAt)}</span>
                  </div>

                  <div className="mt-2 line-clamp-2 text-sm font-semibold tracking-tight">
                    {item.title}
                  </div>

                  {item.summary && (
                    <div className="mt-2 line-clamp-2 text-xs text-white/70">
                      {item.summary}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
                    <span>{item.byline ?? item.source}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5">
                      Open →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}