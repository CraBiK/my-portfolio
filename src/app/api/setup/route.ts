import postgres from 'postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
  try {
    // 1. БРЕНДИНГ И ДИЗАЙН
    await sql`CREATE TABLE IF NOT EXISTS settings (id SERIAL PRIMARY KEY, key TEXT UNIQUE, value TEXT);`;
    await sql`
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT false, -- Убеждаемся, что колонка называется именно так
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
    // 2. КОНТЕНТ (ПРОЕКТЫ, СТРАНИЦЫ, НАВЫКИ)
    await sql`CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT, slug TEXT UNIQUE, image_url TEXT, description TEXT, content JSONB, tech_stack TEXT[], live_url TEXT, github_url TEXT, featured BOOLEAN DEFAULT false, order_index INT);`;
    await sql`CREATE TABLE IF NOT EXISTS pages (id SERIAL PRIMARY KEY, title TEXT, slug TEXT UNIQUE, content JSONB, meta_title TEXT, meta_desc TEXT, published BOOLEAN DEFAULT true);`;
    await sql`CREATE TABLE IF NOT EXISTS skills (id SERIAL PRIMARY KEY, name TEXT, category TEXT, icon TEXT, level INT);`;
    await sql`CREATE TABLE IF NOT EXISTS experience (id SERIAL PRIMARY KEY, title TEXT, company TEXT, period TEXT, description TEXT, type TEXT);`;

    // 3. НАВИГАЦИЯ (ДИНАМИЧЕСКОЕ МЕНЮ)
    await sql`CREATE TABLE IF NOT EXISTS navigation (id SERIAL PRIMARY KEY, label TEXT, url TEXT, order_index INT, parent_id INT);`;

    // 4. ЛИДЫ И СООБЩЕНИЯ
    await sql`CREATE TABLE IF NOT EXISTS leads (id SERIAL PRIMARY KEY, name TEXT, email TEXT, message TEXT, status TEXT DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

    // 5. ПОЛЬЗОВАТЕЛИ (пароль — хеш bcrypt)
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );`;

    // Инициализация "Пульта Управления"
    await sql`INSERT INTO settings (key, value) VALUES 
      ('site_name', 'WEB.CODER.PRO'),
      ('logo_type', 'svg'), -- 'svg' or 'image'
      ('logo_data', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>'),
      ('primary_color', '#6366f1'),
      ('font_family', 'Geist Sans'),
      ('footer_text', '© 2026 Crafted by Web Coder')
      ON CONFLICT (key) DO NOTHING;`;

    return NextResponse.json({ message: "СИСТЕМА УПРАВЛЕНИЯ РАЗВЕРНУТА. ВСЕ МОДУЛИ ГОТОВЫ." });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}