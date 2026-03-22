import { sql } from '@/lib/db';
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
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
    <header className="sticky top-0 z-50 h-[var(--header-height)] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center justify-between">
        {/* Логотип */}
        <Logo />
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
        
        {/* Навигация — не забудьте про отступ или обертку, если она была в пропавших правках */}
        <div className="flex items-center gap-4">
           
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
					 
        </div>
      </div>
    </header>
  );
}