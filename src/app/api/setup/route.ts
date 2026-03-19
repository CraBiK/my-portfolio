import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Таблица для проектов
    await sql`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT,
      link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    // Таблица для настроек дизайна (цвета, лого)
    await sql`CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    );`;

    return NextResponse.json({ message: "Таблицы созданы успешно" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}