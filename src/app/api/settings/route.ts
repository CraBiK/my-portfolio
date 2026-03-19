import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { key, value } = await request.json();
  // Используем UPSERT (обновить если есть, иначе создать)
  await sql`
    INSERT INTO settings (key, value) 
    VALUES (${key}, ${value}) 
    ON CONFLICT (key) DO UPDATE SET value = ${value}
  `;
  return NextResponse.json({ success: true });
}