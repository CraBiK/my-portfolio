'use server';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/auth';

interface AllSettings {
  header_height: number;
  logo_width: number;
  logo_height: number;
  logo_url: string;
  logo_custom_style: string;
  custom_css: string;
  site_title: string;
  site_description: string;
}

export async function updateAllSettings(data: AllSettings) {
  try {
    // 1. ПРОВЕРКА АВТОРИЗАЦИИ (Безопасность)
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await decrypt(token);

    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Доступ запрещен: требуется роль администратора' };
    }

    // 2. ОБНОВЛЕНИЕ ГЛОБАЛЬНЫХ НАСТРОЕК
    await sql`
      UPDATE global_settings
      SET
        header_height = ${data.header_height},
        logo_width = ${data.logo_width},
        logo_height = ${data.logo_height},
        logo_url = ${data.logo_url},
        logo_custom_style = ${data.logo_custom_style},
        custom_css = ${data.custom_css},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    // 3. ОБНОВЛЕНИЕ SEO
    await sql`
      UPDATE seo
      SET
        title = ${data.site_title},
        description = ${data.site_description}
      WHERE page = 'home'
    `;

    revalidatePath('/', 'layout');
    return { success: true };

  } catch (error) {
    console.error('Update Error:', error);
    return { success: false, error: 'Ошибка при сохранении в базу данных Neon' };
  }
}