import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const pages = await sql`SELECT * FROM pages ORDER BY title ASC`;
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  const { title, slug, content } = await req.json();
  await sql`
    INSERT INTO pages (title, slug, content) 
    VALUES (${title}, ${slug}, ${content})
    ON CONFLICT (slug) DO UPDATE SET title = ${title}, content = ${content}
  `;
  return NextResponse.json({ success: true });
}