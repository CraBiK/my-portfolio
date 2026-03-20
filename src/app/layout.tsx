import { sql } from '@/lib/db';
import './globals.css';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let cfg: Record<string, string> = {};

  try {
    // Драйвер 'postgres' возвращает результат напрямую как массив
    const settings = await sql`SELECT key, value FROM settings`;
    
    // Превращаем массив объектов [{key: '...', value: '...'}] в удобный объект
    cfg = Object.fromEntries(settings.map(s => [s.key, s.value]));
  } catch (e) {
    console.warn("⚠️ База еще не инициализирована или пуста. Используем дефолты.");
  }

  const primaryColor = cfg.primary_color || '#6366f1';
  const borderRadius = cfg.border_radius || '16px';
  const fontFamily = cfg.font_family || 'Geist Sans';

  return (
    <html lang="ru">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${primaryColor};
            --radius: ${borderRadius};
            --font-main: "${fontFamily}", sans-serif;
          }
          body { 
            font-family: var(--font-main); 
            background: #050505;
            color: #ffffff;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}