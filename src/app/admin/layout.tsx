import { LayoutDashboard, Rocket, FileText, Share2, Layers, Shield, Palette } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    { name: 'Обзор', icon: <LayoutDashboard size={18}/>, href: '/admin' },
    { name: 'Проекты', icon: <Rocket size={18}/>, href: '/admin/projects' },
    { name: 'Страницы', icon: <FileText size={18}/>, href: '/admin/pages' },
    { name: 'Меню', icon: <Layers size={18}/>, href: '/admin/navigation' },
    { name: 'Брендинг', icon: <Palette size={18}/>, href: '/admin/branding' },
    { name: 'SEO', icon: <Shield size={18}/>, href: '/admin/seo' },
  ];

  return (
    <div className="flex min-h-screen bg-[#080808] text-slate-200">
      <aside className="w-72 border-r border-white/5 bg-[#0a0a0a] p-8 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]">
            <Shield className="text-white" size={24}/>
          </div>
          <span className="text-xl font-black tracking-tighter text-white">CORE ADMIN</span>
        </div>
        <nav className="flex-1 space-y-2">
          {menu.map(item => (
            <a key={item.name} href={item.href} className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 transition group">
              <span className="group-hover:text-indigo-400 transition">{item.icon}</span>
              <span className="font-medium group-hover:text-white transition">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>
      <main className="ml-72 flex-1 p-12">{children}</main>
    </div>
  );
}