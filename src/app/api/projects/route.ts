import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Получение списка проектов
export async function GET() {
  const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

// Добавление нового проекта
export async function POST(request: Request) {
  const { title, image_url } = await request.json();
  await sql`INSERT INTO projects (title, image_url) VALUES (${title}, ${image_url})`;
  return NextResponse.json({ success: true });
}