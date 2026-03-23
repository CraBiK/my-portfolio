'use server';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

interface AllSettings {
  header_height: number;
  logo_width: number;
  logo_height: number;
  logo_url: string;
  logo_type: 'image' | 'svg';
  logo_data?: string;
  logo_custom_style: string;
  custom_css: string;
  site_title: string;
  site_description: string;
  footer_text: string;
}

export async function updateAllSettings(data: AllSettings) {
  try {
    await requireAdmin();

    await sql`
      UPDATE global_settings
      SET
        header_height = ${data.header_height},
        logo_width = ${data.logo_width},
        logo_height = ${data.logo_height},
        logo_url = ${data.logo_url},
        logo_type = ${data.logo_type},
        logo_data = ${data.logo_data || null},
        logo_custom_style = ${data.logo_custom_style},
        custom_css = ${data.custom_css},
        footer_text = ${data.footer_text},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    await sql`
      UPDATE seo SET title = ${data.site_title}, description = ${data.site_description}
      WHERE page = 'home'
    `;

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Update Error:', error);
    return { success: false, error: 'Ошибка сохранения в базу данных' };
  }
}