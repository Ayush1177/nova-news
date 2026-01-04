import { Shell } from "@/components/Shell";
import { NewsGrid, type NewsCard } from "@/components/NewsGrid";

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

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

async function getGuardianNews(section: string, limit: number): Promise<NewsCard[]> {
  const key = process.env.GUARDIAN_API_KEY?.trim();


  if (!key) throw new Error("GUARDIAN_API_KEY missing in .env.local");

  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("api-key", key);
  url.searchParams.set("section", section);
  url.searchParams.set("page-size", String(Math.min(limit, 50)));
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("show-fields", "thumbnail,trailText,byline");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Guardian failed: ${res.status}`);

  const data = await res.json();
  const results: GuardianItem[] = data?.response?.results ?? [];

  return results.map((r) => ({
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
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const sp = await searchParams;
  const section = sp.section ?? "world";

  const sections = ["world", "technology", "business", "sport", "science", "culture"];
  const items = await getGuardianNews(section, 20);

  return (
    <Shell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold tracking-tight">Global News</div>
            <div className="text-xs text-white/60">
              Live headlines powered by The Guardian (cached).
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s}
                href={`/news?section=${s}`}
                className={[
                  "rounded-full border px-3 py-1 text-xs transition",
                  s === section
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <NewsGrid items={items} />
      </div>
    </Shell>
  );
}