import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.content || typeof body.content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      author: typeof body.author === "string" && body.author.trim() ? body.author : "anonymous",
      title: typeof body.title === "string" && body.title.trim() ? body.title : null,
      content: body.content,
    },
  });

  return NextResponse.json(post, { status: 201 });
}