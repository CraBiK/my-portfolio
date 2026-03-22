import { sql } from '@/lib/db';

export async function Logo() {
  const [s] = await sql`SELECT logo_url, logo_custom_style FROM global_settings WHERE id = 1`;

  return (
    <img 
      src={s?.logo_url || '/logo.svg'} 
      alt="Logo"
      className="object-contain"
      style={{ 
        width: 'var(--logo-width)', 
        height: 'var(--logo-height)',
        cssText: s?.logo_custom_style // Применяем кастомный стиль (напр. фильтр)
      } as any}
    />
  );
}
