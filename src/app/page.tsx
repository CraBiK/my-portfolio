import Header from "@/components/Header";
import { sql } from '@/lib/db';
import { ArrowUpRight, Github, Mail, Terminal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Получаем всё параллельно для скорости
  const [nav, projects, skills] = await Promise.all([
    sql`SELECT * FROM navigation ORDER BY order_index ASC`,
    sql`SELECT * FROM projects ORDER BY created_at DESC LIMIT 6`,
    sql`SELECT * FROM skills ORDER BY category, level DESC`
  ]);

  return (
		<>
			<Header /> {/* Твой хедер теперь здесь! */}
    <div className="min-h-screen bg-[#050505] text-slate-300">
      {/* 1. Header (Dynamic Nav) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <span className="text-xl font-black tracking-tighter text-white">
            WEB<span style={{ color: 'var(--primary)' }}>.</span>CODER
          </span>
          <div className="hidden md:flex gap-8">
            {nav.map(item => (
              <a key={item.id} href={item.url} className="text-xs font-bold uppercase tracking-widest hover:text-white transition">
                {item.label}
              </a>
            ))}
          </div>
          <a href="/admin" className="text-[10px] opacity-20 hover:opacity-100 transition">CMS</a>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.8]">
          CRAFTING <br /> 
          <span style={{ color: 'var(--primary)' }}>DIGITAL</span> EXPERIENCE
        </h1>
        <p className="max-w-xl text-lg text-slate-500 leading-relaxed">
          Я создаю высокопроизводительные веб-приложения и системы управления, где каждый пиксель имеет значение.
        </p>
      </section>

      {/* 3. Skills Matrix (from Admin) */}
      <section className="py-20 px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight italic">Tech Stack</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl hover:border-indigo-500/30 transition group">
              <div className="text-indigo-500 mb-4 group-hover:scale-110 transition">
                <Terminal size={24} />
              </div>
              <div className="font-bold text-white text-sm uppercase">{skill.name}</div>
              <div className="text-[10px] text-slate-600 mt-1">{skill.level}% Mastery</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Portfolio (from Admin) */}
      <section className="py-20 px-8 max-w-7xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-bold text-white tracking-tight italic mb-12">Featured Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map(project => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 mb-6">
                <img 
                  src={project.image_url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ArrowUpRight size={48} className="text-white" />
                </div>
              </div>
              <div className="flex justify-between items-start px-4">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase">{project.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {project.tech_stack?.map((t: string) => (
                      <span key={t} className="text-[10px] text-slate-500 border border-white/10 px-2 py-1 rounded-md uppercase font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center gap-6 mb-8">
           <Github className="cursor-pointer hover:text-white transition" />
           <Mail className="cursor-pointer hover:text-white transition" />
        </div>
        <p className="text-xs text-slate-600 uppercase tracking-widest">
           {/* Данные подтянутся из site_config в layout.tsx */}
           Built on Next.js 16 & Neon SQL
        </p>
      </footer>
    </div>
		</>
  );
}