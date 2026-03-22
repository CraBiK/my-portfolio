import Header from "@/components/Header";
import { sql } from '@/lib/db';
import { ThemeToggle } from "../components/ThemeToggle";
import { ArrowUpRight, Github, Mail, Terminal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [nav, projects, skills] = await Promise.all([
    sql`SELECT * FROM navigation ORDER BY order_index ASC`,
    sql`SELECT * FROM projects ORDER BY created_at DESC LIMIT 6`,
    sql`SELECT * FROM skills ORDER BY category, level DESC`
  ]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
        {/* 1. Навигация */}
 

        {/* 2. Герой-секция */}
        <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.8] uppercase italic">
            I build <br /> 
            <span className="text-primary">lightning-fast</span> custom websites.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed font-medium">
          I help businesses and individuals build premium, high-performance web experiences.
          </p>
        </section>

        {/* 3. Матрица навыков */}
        <section className="py-20 px-8 max-w-7xl mx-auto border-t border-border">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black text-foreground tracking-tight italic uppercase">Tech Stack:</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map(skill => (
              <div 
                key={skill.id} 
                className="p-6 bg-card border border-border rounded-3xl hover:border-primary/40 transition-all group shadow-sm"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Terminal size={24} />
                </div>
                <div className="font-black text-foreground text-xs uppercase tracking-tight">{skill.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">
                  Опыт: {skill.level}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Портфолио */}
        <section className="py-20 px-8 max-w-7xl mx-auto border-t border-border">
          <h2 className="text-3xl font-black text-foreground tracking-tight italic mb-12 uppercase">Избранные проекты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map(project => (
              <div key={project.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-muted border border-border mb-6">
                  <img 
                    src={project.image_url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={project.title}
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <ArrowUpRight size={48} className="text-primary" />
                  </div>
                </div>
                <div className="flex justify-between items-start px-4">
                  <div>
                    <h3 className="text-xl font-black text-foreground uppercase italic tracking-tight">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tech_stack?.map((t: string) => (
                        <span 
                          key={t} 
                          className="text-[10px] font-bold text-muted-foreground border border-border px-3 py-1 rounded-full uppercase tracking-tighter bg-secondary/50"
                        >
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

        {/* 5. Подвал */}
        <footer className="py-20 border-t border-border text-center bg-card/30">
          <div className="flex justify-center gap-6 mb-8">
             <Github className="cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
             <Mail className="cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
             Создано на Next.js 16 & Neon SQL
          </p>
        </footer>
      </div>
    </>
  );
}