'use client';
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/admin/logout";
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Rocket, FileText, Share2, Layers, Shield, Palette, Bolt, Images } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    { name: 'Обзор', icon: <LayoutDashboard size={18}/>, href: '/admin' },
    { name: 'Проекты', icon: <Rocket size={18}/>, href: '/admin/projects' },
    { name: 'Страницы', icon: <FileText size={18}/>, href: '/admin/pages' },
    { name: 'Меню', icon: <Layers size={18}/>, href: '/admin/navigation' },
    { name: 'Медиа', icon: <Images size={18}/>, href: '/admin/media' },
    { name: 'SEO', icon: <Shield size={18}/>, href: '/admin/seo' },
		{ name: 'Settings', icon: <Bolt size={18}/>, href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Боковая панель */}
      <aside className="w-72 border-r border-border bg-card p-8 flex flex-col fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-primary-foreground" size={24}/>
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground uppercase italic">CORE ADMIN</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menu.map(item => (
            <a 
              key={item.name} 
              href={item.href} 
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all group outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="group-hover:text-primary transition-colors">{item.icon}</span>
              <span className="font-bold text-xs uppercase tracking-widest transition-colors">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Основная область контента */}
      <div className="flex-1 ml-72 flex flex-col">
        <header className="h-20 border-b border-border flex items-center justify-between px-10 sticky top-0 bg-background/80 backdrop-blur-md z-40">
           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
             Панель управления / <span className="text-foreground">Обзор</span>
           </div>
           
           <div className="flex items-center gap-4">
              <ThemeToggle />
              <LogoutButton />
           </div>
        </header>

        <main className="p-12 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}