"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsGrid, type NewsCard } from "@/components/NewsGrid";

type Props = {
  section?: string;
};

export function FeedNews({ section = "world" }: Props) {
  const [items, setItems] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const url = useMemo(
    () => `/api/news?section=${encodeURIComponent(section)}&limit=12`,
    [section]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`news failed: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        setItems(data.items ?? []);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load news");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [url]);

  if (loading) {
    return <div className="text-sm text-white/60">Loading news…</div>;
  }

  if (err) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Could not load news. {err}
      </div>
    );
  }

  return <NewsGrid items={items} />;
}