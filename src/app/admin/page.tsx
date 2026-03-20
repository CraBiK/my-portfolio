import { sql } from '@/lib/db';
import { Rocket, Mail, Cpu, FileText, MousePointer2, Settings2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Получаем статистику напрямую из SQL
  const stats = await Promise.all([
    sql`SELECT count(*) FROM projects`,
    sql`SELECT count(*) FROM skills`,
    sql`SELECT count(*) FROM messages WHERE is_read = false`,
    sql`SELECT value FROM settings WHERE key = 'site_name'`
  ]);

  const data = [
    { label: 'Проекты', value: stats[0][0].count, icon: <Rocket size={20}/>, color: 'text-blue-500' },
    { label: 'Технологии', value: stats[1][0].count, icon: <Cpu size={20}/>, color: 'text-purple-500' },
    { label: 'Новые сообщения', value: stats[2][0].count, icon: <Mail size={20}/>, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
          Welcome back, <span className="text-indigo-500">Coder</span>
        </h1>
        <p className="text-slate-500 mt-2">Система управления сайтом {stats[3][0]?.value}</p>
      </header>

      {/* Сетка Статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.label} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-white/20 transition">
            <div>
              <div className="text-4xl font-black text-white mb-1">{item.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</div>
            </div>
            <div className={`p-4 bg-black rounded-2xl border border-white/5 ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#0f0f0f] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6">Быстрый запуск</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/projects" className="p-6 bg-black rounded-2xl border border-white/5 hover:bg-white/5 transition flex flex-col items-center gap-3">
                <PlusIcon className="text-indigo-500" />
                <span className="text-sm font-bold">Добавить проект</span>
              </a>
              <a href="/admin/appearance" className="p-6 bg-black rounded-2xl border border-white/5 hover:bg-white/5 transition flex flex-col items-center gap-3">
                <Settings2 className="text-indigo-500" />
                <span className="text-sm font-bold">Дизайн системы</span>
              </a>
            </div>
          </div>
          {/* Декор */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
        </section>

        {/* Системная информация */}
        <section className="bg-indigo-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
               <MousePointer2 size={24}/> Контроль трафика
            </h2>
            <p className="text-indigo-100 leading-relaxed text-sm">
              Ваша база данных Neon (Postgres 17) подключена и работает стабильно. 
              Все медиа-файлы хранятся в Vercel Blob и доставляются через CDN.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-4">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400" />)}
             </div>
             <span className="text-xs font-bold uppercase tracking-widest opacity-80">System Secure</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}