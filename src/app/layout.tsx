import { sql } from '@/lib/db';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { Montserrat, Nunito, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'], // Явно укажи веса
  display: 'swap', 
  variable:'--font-serif'
});
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

interface GlobalSettings {
  header_height: number;
  logo_width: number;
  logo_height: number;
  logo_url: string;
  logo_custom_style: string;
  custom_css: string;
}

export async function generateMetadata({ params }: { params: any }) {
  // Определяем, на какой мы странице (например, 'home')
  const pageKey = 'home'; 
  
  const [seo] = await sql`SELECT title, description FROM seo WHERE page = ${pageKey}`;

  return {
    title: seo?.title || "Дефолтный заголовок",
    description: seo?.description || "Дефолтное описание",
  };
}

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Получаем настройки из Neon
  // Добавляем [0], так как sql обычно возвращает массив
  const [settings] = await sql<GlobalSettings[]>`
    SELECT * FROM global_settings WHERE id = 1 LIMIT 1
  `;

  // Фоллбек на случай, если база пуста (чтобы сайт не упал)
  const s = settings || {
    header_height: 64,
    logo_width: 120,
    logo_height: 40,
    logo_url: '/logo.png',
    logo_custom_style: '',
    custom_css: ''
  };

  return (
    <html lang="ru" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      
      <body 
        style={{ 
          '--header-height': `${s.header_height}px`,
          '--logo-width': `${s.logo_width}px`,
          '--logo-height': `${s.logo_height}px`
        } as React.CSSProperties}
        className="min-h-screen bg-background font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}