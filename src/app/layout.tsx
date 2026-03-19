import { sql } from '@/lib/db';
import './globals.css';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Достаем цвет и заголовок из базы
  const settings = await sql`SELECT key, value FROM settings`;
  const config = Object.fromEntries(settings.map(s => [s.key, s.value]));
  
  const primaryColor = config.primary_color || '#000000';

  return (
    <html lang="ru">
      <head>
        <title>{config.site_title}</title>
      </head>
      <body 
        className="antialiased" 
        style={{ '--primary': primaryColor } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}