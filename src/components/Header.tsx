import { sql } from '@/lib/db';
import { ThemeToggle } from "./ThemeToggle";

export default async function Header() {
  // Получаем логотип и меню из базы
  const [nav, settings] = await Promise.all([
    sql`SELECT * FROM navigation ORDER BY order_index ASC`,
    sql`SELECT key, value FROM settings WHERE key IN ('logo_data', 'logo_type', 'logo_image_url')`
  ]);

  const cfg = Object.fromEntries(settings.map(s => [s.key, s.value]));
	
  const logoType = cfg.logo_type || 'svg';
  const logoData = cfg.logo_data || 'ВЕБ.КОДЕР';
  const logoImageUrl = cfg.logo_image_url;

  return (
    <header className="fixed top-0 w-full z-50  bg-background/80 backdrop-blur-xl text-foreground transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8 h-28 flex justify-between items-center">
        {/* ЛОГОТИП (SVG или Текст) */}
        <div className="h-28 flex items-center">
					{logoType === 'image' && logoImageUrl ? (
						<img 
							src={logoImageUrl} 
							alt="Logo" 
							className="w-full h-28 object-contain " 
						/>
					) : (
						<div 
							className="h-8 flex items-center gap-2 font-black tracking-tighter text-primary uppercase italic"
							dangerouslySetInnerHTML={{ 
								__html: logoData.startsWith('<svg') ? logoData : `<span>${logoData}</span>` 
							}}
						/>
					)}
			</div>

        {/* НАВИГАЦИЯ */}
        <nav className="hidden md:flex gap-10 items-center">
          {nav.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {item.label}
            </a>
          ))}
          
          {/* ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ */}
          <ThemeToggle />
        </nav>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ (Мобильная версия) */}
        <a href="/admin" className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all">
          Админ
        </a>
      </div>
    </header>
  );
}