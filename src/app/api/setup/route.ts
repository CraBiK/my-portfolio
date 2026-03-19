import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Выполняем создание таблиц
    await sql`CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT NOT NULL, image_url TEXT NOT NULL, description TEXT, link TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    await sql`CREATE TABLE IF NOT EXISTS settings (id SERIAL PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT NOT NULL);`;
    await sql`INSERT INTO settings (key, value) VALUES ('primary_color', '#000000') ON CONFLICT (key) DO NOTHING;`;

    return NextResponse.json({ message: "База данных готова!" });
  } catch (error: any) {
    // Возвращаем РЕАЛЬНУЮ ошибку для диагностики
    return NextResponse.json({ 
      error: "Ошибка подключения к базе", 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}