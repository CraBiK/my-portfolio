import { sql } from '@/lib/db';
import './globals.css';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Получаем все настройки из базы одним запросом
  const { rows } = await sql`SELECT key, value FROM settings`;
  const cfg = Object.fromEntries(rows.map(r => [r.key, r.value]));

  return (
    <html lang="ru">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${cfg.primary_color || '#6366f1'};
            --radius: ${cfg.border_radius || '16px'};
            --font-main: "${cfg.font_family || 'Geist Sans'}", sans-serif;
          }
          body { 
            font-family: var(--font-main); 
            background: #050505;
          }
          .rounded-custom { border-radius: var(--radius); }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}