import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Проекты
    await sql`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      tech_stack TEXT[],
      github_link TEXT,
      live_link TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    // 2. Настройки дизайна и глобальные данные
    await sql`CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    );`;

    // 3. SEO и Контакты
    await sql`CREATE TABLE IF NOT EXISTS seo (id SERIAL PRIMARY KEY, page TEXT UNIQUE, title TEXT, description TEXT);`;
    await sql`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, name TEXT, email TEXT, text TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

    // Дефолтные настройки
    await sql`INSERT INTO settings (key, value) VALUES 
      ('primary_color', '#000000'),
      ('site_title', 'My Portfolio'),
      ('footer_text', '© 2026 Web Coder')
      ON CONFLICT (key) DO NOTHING;`;

    return NextResponse.json({ status: "Success", message: "Инфраструктура Neon.tech готова!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}