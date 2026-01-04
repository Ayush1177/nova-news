"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TiltCard } from "@/components/TiltCard";

type MockPost = {
  id: string;
  author: string;
  title?: string;
  body: string;
  time: string;
};

export function FeedMock() {
  const [text, setText] = useState("");

  const posts: MockPost[] = useMemo(
    () => [
      {
        id: "1",
        author: "nova.ai",
        title: "The hidden cost of always being busy",
        body:
          "Busyness feels productive, but it often hides avoidance. This platform will help you publish clarity, not noise.",
        time: "just now",
      },
      {
        id: "2",
        author: "worldwire",
        title: "Signals are the new currency",
        body:
          "We’re building a feed that blends your writing with verified global news signals — one interface, two sources of truth.",
        time: "2h ago",
      },
      {
        id: "3",
        author: "ayush",
        body:
          "Portfolio mode: sleek UI, fast UX, production-ready architecture. Next step: auth + database + real news.",
        time: "yesterday",
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <TiltCard className="p-5">
        <div className="text-sm text-white/70">Create a post</div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a post… (backend comes next)"
          rows={4}
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-white/60">
            Tip: hover cards to feel the tilt.
          </div>
          <button
            onClick={() => setText("")}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
          >
            Clear
          </button>
        </div>
      </TiltCard>

      <div className="space-y-3">
        {posts.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.25) }}
          >
            <TiltCard className="p-5">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>@{p.author}</span>
                <span>{p.time}</span>
              </div>

              {p.title && (
                <div className="mt-2 text-base font-semibold tracking-tight">
                  {p.title}
                </div>
              )}

              <div className="mt-2 text-sm text-white/80">{p.body}</div>

              <div className="mt-4 flex gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Like
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Repost
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Share
                </span>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}