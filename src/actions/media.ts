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

