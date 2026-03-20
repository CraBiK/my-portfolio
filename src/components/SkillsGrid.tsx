import { Cpu } from 'lucide-react';

export default function SkillsGrid({ skills }: { skills: any[] }) {
  return (
    <section className="py-24 max-w-7xl mx-auto px-8">
      <h2 className="text-6xl font-black tracking-tighter mb-20 italic text-muted-foreground/10 uppercase select-none">
        Стек технологий
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {skills.map(skill => (
          <div 
            key={skill.id} 
            className="group relative bg-card text-card-foreground border border-border p-8 rounded-[2rem] hover:bg-primary hover:text-primary-foreground transition-all duration-500 cursor-default shadow-sm hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            <div className="text-primary group-hover:text-primary-foreground transition-colors mb-4">
               {/* Иконка навыка */}
               <Cpu size={32} strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-foreground group-hover:text-primary-foreground group-hover:translate-x-1 transition-all duration-300 uppercase tracking-tight">
              {skill.name}
            </h4>
            <div className="absolute bottom-4 right-6 text-[10px] font-black opacity-0 group-hover:opacity-40 transition-opacity uppercase tracking-widest font-mono">
              {skill.level}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}