'use server';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
//import { cookies } from 'next/headers';
import { requireAdmin } from '@/lib/auth';

interface AllSettings {
  // Layout & Logo
  header_height: number;
  logo_width: number;
  logo_height: number;
  logo_url: string;
  logo_type: 'svg' | 'image';
  logo_data?: string;
  logo_custom_style: string;
  // Design Tokens
  primary_color: string;
  font_family: string;
  border_radius: string;
  custom_css: string;
  // SEO & Text
  site_title: string;
  site_description: string;
  footer_text: string;
}

export async function updateAllSettings(data: AllSettings) {
  try {
    await requireAdmin();

    // 1. Обновление глобальных настроек (включая токены дизайна)
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
        primary_color = ${data.primary_color},
        font_family = ${data.font_family},
        border_radius = ${data.border_radius},
        custom_css = ${data.custom_css},
        footer_text = ${data.footer_text},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    // 2. Обновление SEO
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
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Ошибка при сохранении' 
    };
  }
}