export const runtime = "nodejs";

import { NextResponse } from "next/server";

type GuardianItem = {
  id: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    byline?: string;
  };
};

type NewsCard = {
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

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") ?? "world";
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const key = process.env.GUARDIAN_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: "GUARDIAN_API_KEY missing in .env.local" },
      { status: 500 }
    );
  }

  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("api-key", key);
  url.searchParams.set("section", section);
  url.searchParams.set("page-size", String(limit));
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("show-fields", "thumbnail,trailText,byline");

  // Cache at Next layer: revalidate every 5 minutes
  const res = await fetch(url.toString(), { next: { revalidate: 300 } });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "Guardian request failed", status: res.status, detail: text.slice(0, 200) },
      { status: 502 }
    );
  }

  const data = await res.json();
  const results: GuardianItem[] = data?.response?.results ?? [];

  const items: NewsCard[] = results.map((r) => ({
    id: r.id,
    title: r.webTitle,
    url: r.webUrl,
    section: r.sectionName,
    publishedAt: r.webPublicationDate,
    summary: r.fields?.trailText ? stripHtml(r.fields.trailText) : null,
    image: r.fields?.thumbnail ?? null,
    byline: r.fields?.byline ?? null,
    source: "The Guardian",
  }));

  return NextResponse.json({ section, count: items.length, items });
}