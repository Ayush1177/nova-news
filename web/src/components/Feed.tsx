"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { TiltCard } from "@/components/TiltCard";

type ApiPost = {
  id: string;
  title: string | null;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

async function fetchPosts(): Promise<ApiPost[]> {
  const res = await fetch("/api/posts", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

async function createPost(payload: { title?: string; content: string }): Promise<ApiPost> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to create post");
  }

  return res.json();
}

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

function initials(name?: string | null) {
  const n = (name ?? "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function Feed() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetchPosts()
      .then((p) => {
        if (!alive) return;
        setPosts(p);
        setError(null);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message ?? "Failed to load posts");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const sortedPosts = useMemo(() => posts, [posts]);

  async function onSubmit() {
    if (!isAuthed) {
      setError("Please sign in to post.");
      return;
    }
    if (!content.trim()) {
      setError("Write something first.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Optimistic post uses session user info
    const optimistic: ApiPost = {
      id: `optimistic-${Date.now()}`,
      title: title.trim() ? title.trim() : null,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      author: {
        id: "me",
        name: session?.user?.name ?? session?.user?.email ?? "You",
        image: (session?.user as any)?.image ?? null,
      },
    };

    setPosts((prev) => [optimistic, ...prev]);

    try {
      const created = await createPost({
        title: optimistic.title ?? undefined,
        content: optimistic.content,
      });

      setPosts((prev) => [created, ...prev.filter((p) => p.id !== optimistic.id)]);
      setTitle("");
      setContent("");
    } catch (e: any) {
      setPosts((prev) => prev.filter((p) => p.id !== optimistic.id));
      setError(e?.message ?? "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Composer */}
      <TiltCard className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">Create a post</div>

          {!isAuthed && (
            <button
              onClick={() => signIn("github")}
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:opacity-90"
            >
              Sign in
            </button>
          )}
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthed ? "Write a post…" : "Sign in to write a post…"}
          rows={4}
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-white/60">
            {isAuthed ? "Tip: hover cards to feel the tilt." : "Sign in to publish posts."}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setTitle("");
                setContent("");
                setError(null);
              }}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
            >
              Clear
            </button>

            <button
              onClick={onSubmit}
              disabled={!isAuthed || submitting}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>

        {error && <div className="mt-3 text-xs text-red-300">{error}</div>}
      </TiltCard>

      {/* Feed */}
      <div className="space-y-3">
        {loading && <div className="text-sm text-white/70">Loading posts…</div>}

        {!loading && sortedPosts.length === 0 && (
          <div className="text-sm text-white/70">No posts yet.</div>
        )}

        {sortedPosts.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.25) }}
          >
            <TiltCard className="p-5">
              <div className="flex items-center justify-between text-xs text-white/60">
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  {p.author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.author.image}
                      alt={p.author.name ?? "user"}
                      className="h-6 w-6 rounded-full border border-white/10"
                    />
                  ) : (
                    <div className="grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-white/5 text-[10px] text-white/80">
                      {initials(p.author.name)}
                    </div>
                  )}

                  <span className="text-white/70">
                    @{(p.author.name ?? "user").toLowerCase().replace(/\s+/g, "")}
                  </span>
                </div>

                <span>{timeAgo(p.createdAt)}</span>
              </div>

              {p.title && <div className="mt-2 text-base font-semibold tracking-tight">{p.title}</div>}

              <div className="mt-2 whitespace-pre-wrap text-sm text-white/80">{p.content}</div>

              <div className="mt-4 flex gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/10 px-3 py-1">Like</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Repost</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Share</span>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}