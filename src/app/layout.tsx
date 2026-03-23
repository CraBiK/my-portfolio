import './globals.css';
import { sql } from '@/lib/db';
import { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider"
import { Montserrat, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'], // Явно укажи веса
  variable:'--font-sans'
});

const fontSerif = Nunito({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'], // Явно укажи веса 
  variable:'--font-serif'
});

interface GlobalSettings {
  header_height: number;
  logo_width: number;
  logo_height: number;
  logo_url: string;
  logo_custom_style: string;
  custom_css: string;
}

export async function generateMetadata(): Promise<Metadata> {
  // Тянем данные для главной страницы
  const [seo] = await sql`SELECT title, description FROM seo WHERE page = 'home' LIMIT 1`;

  return {
    title: seo?.title || " ",
    description: seo?.description || " ",
    // Здесь же можно добавить иконку из настроек, если захочешь
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Твой существующий код получения global_settings
  const [settings] = await sql`SELECT * FROM global_settings WHERE id = 1 LIMIT 1`;

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
				<script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
        {/* Инъекция стилей */}
        <style dangerouslySetInnerHTML={{ __html: settings?.custom_css || "" }} />
      </head>
      <body className={`${fontSans.variable} ${fontSerif.variable} antialiased`} style={{ 
        '--header-height': `${settings?.header_height || 64}px`,
        '--logo-width': `${settings?.logo_width || 120}px`,
        '--logo-height': `${settings?.logo_height || 40}px`
      } as React.CSSProperties}>
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