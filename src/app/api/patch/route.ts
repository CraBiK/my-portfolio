import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Принудительно создаем таблицу messages, если её нет
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Если таблица есть, но колонки нет — добавляем её
    await sql`
      ALTER TABLE messages 
      ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
    `;

    return NextResponse.json({ success: true, message: "Колонка is_read успешно добавлена или уже существует!" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}