'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

interface GlobalSettings {
  header_height?: number;
  logo_width?: number;
  logo_height?: number;
  logo_url?: string;         // <-- Новое поле
  logo_custom_style?: string; // <-- Новое поле
  custom_css?: string;
}

export async function updateGlobalSettings(settings: GlobalSettings) {
  try {
    const { 
      header_height, 
      logo_width, 
      logo_height, 
      logo_url, 
      logo_custom_style, 
      custom_css 
    } = settings;
    
    await sql`
      UPDATE global_settings
      SET
        header_height = ${header_height},
        logo_width = ${logo_width},
        logo_height = ${logo_height},
        logo_url = ${logo_url},
        logo_custom_style = ${logo_custom_style},
        custom_css = ${custom_css},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1;
    `;
    
    // Сбрасываем кэш для главной и всех страниц, 
    // так как эти настройки влияют на Layout
    revalidatePath('/', 'layout');
    
    return { success: true, message: 'Настройки успешно обновлены!' };
  } catch (error) {
    console.error('Failed to update global settings:', error);
    return { success: false, error: 'Ошибка при обновлении настроек в базе Neon.' };
  }
}
