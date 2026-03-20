import { sql } from '@/lib/db';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let cfg: Record<string, string> = {};

  try {
    const settings = await sql`SELECT key, value FROM settings`;
    cfg = Object.fromEntries(settings.map(s => [s.key, s.value]));
  } catch (e) {
    console.warn("⚠️ База данных не инициализирована. Используются стандартные настройки.");
  }

  const primaryColor = cfg.primary_color || '#6366f1';
  const borderRadius = cfg.border_radius || '16px';
  const fontFamily = cfg.font_family || 'Geist Sans';

  return (
    <html lang="ru" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${primaryColor};
            --radius: ${borderRadius};
          }
          body {
            font-family: ${fontFamily}, var(--font-sans);
          }
        `}} />
      </head>
      <body className="antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}