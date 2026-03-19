import postgres from 'postgres';
import { NextResponse } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  const skills = await sql`SELECT * FROM skills ORDER BY category, level DESC`;
  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  const { name, category, level, icon } = await req.json();
  await sql`
    INSERT INTO skills (name, category, level, icon) 
    VALUES (${name}, ${category}, ${level}, ${icon})
  `;
  return NextResponse.json({ success: true });
}