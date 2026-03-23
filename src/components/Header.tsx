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
    <header className="sticky top-0 z-50 h-[var(--header-height)] w-full border-b bg-background/80 backdrop-blur-xl text-foreground">
      <div className="container flex h-full items-center justify-between mx-auto max-w-7xl">
        <div className="relative flex-none mx-auto h-lg items-center logo">
          <Logo />
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
          
          <ThemeToggle />
        </nav>
					 
        </div>
      </div>
    </header>
  );
}