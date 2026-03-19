import { sql } from '@vercel/postgres';
import './globals.css';

// 1. Принудительно делаем все страницы динамическими
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let primaryColor = '#000000'; // Цвет по умолчанию (черный)

  try {
    // 2. Оборачиваем запрос в try/catch, чтобы билд не падал
    const { rows } = await sql`SELECT value FROM settings WHERE key = 'primary_color' LIMIT 1`;
    if (rows && rows[0]) {
      primaryColor = rows[0].value;
    }
  } catch (error) {
    console.error("Database not ready yet, using default color.");
  }

  return (
    <html lang="ru">
      <body style={{ '--primary': primaryColor } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}