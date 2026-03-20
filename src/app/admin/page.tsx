import { sql } from '@/lib/db';
import { Rocket, Mail, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let projectsCount = 0;
  let skillsCount = 0;
  let newMessages = 0;

  try {
    const pRes = await sql`SELECT count(*) FROM projects`;
    projectsCount = pRes[0].count;

    const sRes = await sql`SELECT count(*) FROM skills`;
    skillsCount = sRes[0].count;

    const mRes = await sql`SELECT count(*) FROM messages WHERE is_read = false`;
    newMessages = mRes[0].count;
  } catch (e) {
    console.error("Ошибка статистики дашборда:", e);
  }

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-black text-foreground tracking-tighter italic uppercase">
        Обзор
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Проекты */}
        <div className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] flex items-center justify-between shadow-sm transition-all hover:border-primary/20">
          <div>
            <div className="text-4xl font-black text-foreground">{projectsCount}</div>
            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
              Проекты
            </div>
          </div>
          <Rocket className="text-primary/60" size={32}/>
        </div>

        {/* Навыки */}
        <div className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] flex items-center justify-between shadow-sm transition-all hover:border-primary/20">
          <div>
            <div className="text-4xl font-black text-foreground">{skillsCount}</div>
            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
              Навыки
            </div>
          </div>
          <Cpu className="text-primary/60" size={32}/>
        </div>

        {/* Сообщения (Акцентная карточка) */}
        <div className="bg-card text-card-foreground border border-primary/20 p-8 rounded-[2rem] flex items-center justify-between shadow-lg shadow-primary/5 transition-all hover:border-primary">
          <div>
            <div className="text-4xl font-black text-primary">{newMessages}</div>
            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
              Новые письма
            </div>
          </div>
          <Mail className="text-primary" size={32}/>
        </div>
      </div>
    </div>
  );
}