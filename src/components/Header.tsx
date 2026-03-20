import { sql } from '@/lib/db';
import { ThemeToggle } from "./ThemeToggle";

export default async function Header() {
  // Получаем логотип и меню из базы (Next.js 15/16 + postgres driver)
  const [nav, logoSetting] = await Promise.all([
    sql`SELECT * FROM navigation ORDER BY order_index ASC`,
    sql`SELECT value FROM settings WHERE key = 'logo_data' LIMIT 1`
  ]);

  const logoData = logoSetting[0]?.value || "WEB.CODER";

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-white/70 dark:bg-black/70 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
        {/* ЛОГОТИП (Динамический: SVG или Текст) */}
        <div 
          className="h-8 flex items-center gap-2 font-black tracking-tighter"
          style={{ color: 'var(--primary)' }}
          dangerouslySetInnerHTML={{ __html: logoData.startsWith('<svg') ? logoData : `<span>${logoData}</span>` }}
        />

        {/* НАВИГАЦИЯ (Из базы) */}
        <nav className="hidden md:flex gap-10 items-center">
          {nav.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-500 transition-colors"
            >
              {item.label}
            </a>
          ))}
          
          {/* КНОПКА ТЕМЫ */}
          <ThemeToggle />
        </nav>

        {/* Ссылка на Админку (только для тебя) */}
        <a href="/admin" className="md:hidden text-xs opacity-20">Admin</a>
      </div>
    </header>
  );
}