# Directory Structure
```
src/actions/auth.ts
src/actions/media.ts
src/actions/settings-actions.ts
src/app/admin/appearance/page.tsx
src/app/admin/branding/page.tsx
src/app/admin/layout.tsx
src/app/admin/media/page.tsx
src/app/admin/navigation/page.tsx
src/app/admin/page.tsx
src/app/admin/pages/page.tsx
src/app/admin/projects/page.tsx
src/app/admin/seo/page.tsx
src/app/admin/settings/page.tsx
src/app/admin/settings/settings-form.tsx
src/app/admin/skills/page.tsx
src/app/api/navigation/route.ts
src/app/api/pages/route.ts
src/app/api/patch/route.ts
src/app/api/projects/route.ts
src/app/api/settings/route.ts
src/app/api/setup/route.ts
src/app/api/skills/route.ts
src/app/api/upload/route.ts
src/app/favicon.ico
src/app/globals.css
src/app/layout.tsx
src/app/login/page.tsx
src/app/page.tsx
src/components/admin/logout.tsx
src/components/admin/media-gallery.tsx
src/components/admin/style-editor.tsx
src/components/custom/status-toast.tsx
src/components/Header.tsx
src/components/Logo.tsx
src/components/SkillsGrid.tsx
src/components/theme-provider.tsx
src/components/ThemeToggle.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/checkbox.tsx
src/components/ui/field.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/separator.tsx
src/components/ui/sonner.tsx
src/components/ui/textarea.tsx
src/lib/auth.ts
src/lib/db.ts
src/lib/password.ts
src/lib/utils.ts
src/proxy.ts
```

## File: src/lib/db.ts
```typescript
import postgres from 'postgres';

// Оптимизированный коннект для Serverless среды
const connectionString = process.env.POSTGRES_URL!;
export const sql = postgres(connectionString, { ssl: 'require' });

// Хелпер для получения одной настройки
export async function getSetting(key: string, defaultValue: string = '') {
  const [setting] = await sql`SELECT value FROM settings WHERE key = ${key}`;
  return setting?.value || defaultValue;
}
```


## File: src/actions/media.ts
```typescript
"use server";

import { del } from "@vercel/blob";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export type MediaRow = {
  id: number;
  url: string;
  name: string;
  size: number | null;
  type: string | null;
  width: number | null;
  height: number | null;
  created_at: Date;
};

export type MediaInsertInput = {
  url: string;
  name: string;
  size?: number | null;
  type?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MediaActionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Сохраняет одну или несколько записей медиа (после загрузки в Blob).
 */
export async function saveMediaRecords(
  items: MediaInsertInput[]
): Promise<MediaActionResult> {
  try {
    await requireAdmin();
    if (!items.length) {
      return { ok: false, error: "Нет данных для сохранения." };
    }
    const rows = items.map((i) => ({
      url: i.url,
      name: i.name,
      size: i.size ?? null,
      type: i.type ?? null,
      width: i.width ?? null,
      height: i.height ?? null,
    }));
    await sql`INSERT INTO media ${sql(rows)}`;
    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Не удалось сохранить медиа.";
    return { ok: false, error: message };
  }
}

/**
 * Удаляет выбранные записи (файлы в Blob нужно удалять отдельно при необходимости).
 */
export async function deleteMediaRecords(
  ids: (string | number)[]
): Promise<MediaActionResult> {
  // 1. Принудительно превращаем все ID в числа для Neon
  const numericIds = ids.map(id => Number(id));

  if (!numericIds.length) {
    return { ok: false, error: "Ничего не выбрано." };
  }

  try {
    await requireAdmin();

    // 2. СНАЧАЛА получаем URL файлов, пока они еще есть в базе
    const rows = await sql<{ url: string }[]>`
      SELECT url FROM media WHERE id = ANY(${numericIds})
    `;

    if (rows.length === 0) {
      return { ok: false, error: "Записи не найдены в базе данных." };
    }

    // 3. ТЕПЕРЬ удаляем записи из базы данных
    await sql`
      DELETE FROM media 
      WHERE id = ANY(${numericIds})
    `;

    // 4. Удаляем физические файлы из Vercel Blob
    for (const { url } of rows) {
      try {
        // Удаляем только если это ссылка на vercel-storage
        if (url.includes('public.blob.vercel-storage.com')) {
          await del(url);
        }
      } catch (err) {
        console.error(`Не удалось удалить файл в Blob: ${url}`, err);
        // Не прерываем цикл, если один файл не удалился
      }
    }

    return { ok: true };
  } catch (e) {
    console.error("Ошибка при удалении медиа:", e);
    const message = e instanceof Error ? e.message : "Не удалось удалить записи.";
    return { ok: false, error: message };
  }
}
```

## File: src/app/layout.tsx
```typescript
import './globals.css';
import { sql } from '@/lib/db';
import { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider"
import { Montserrat, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'], // Явно укажи веса
  display: 'swap', 
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
        {/* Инъекция стилей */}
        <style dangerouslySetInnerHTML={{ __html: settings?.custom_css || "" }} />
      </head>
      <body style={{ 
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
```
