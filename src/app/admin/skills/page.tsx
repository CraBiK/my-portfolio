'use client';
import { useState, useEffect } from 'react';
import { Cpu, Plus, Zap, Code2, Database, Terminal } from 'lucide-react';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['Frontend', 'Backend', 'DevOps', 'Инструменты', 'Дизайн'];

  const loadSkills = () => fetch('/api/skills').then(res => res.json()).then(setSkills);
  useEffect(() => { loadSkills(); }, []);

  async function addSkill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    await fetch('/api/skills', {
      method: 'POST',
      body: JSON.stringify({
        name: fd.get('name'),
        category: fd.get('category'),
        level: parseInt(fd.get('level') as string),
        icon: fd.get('icon') || 'Terminal'
      })
    });
    setLoading(false);
    loadSkills();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">
            Матрица навыков
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Визуализация вашего технологического арсенала</p>
        </div>
        <div className="text-primary font-mono text-sm font-bold">Всего: {skills.length}</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Форма добавления */}
        <section className="bg-card text-card-foreground border border-border p-8 rounded-[2.5rem] h-fit sticky top-10 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Plus className="text-primary" size={20}/> Добавить навык
          </h2>
          <form onSubmit={addSkill} className="space-y-5">
            <input 
              name="name" 
              placeholder="Название (напр. React)" 
              className="w-full bg-background border border-input rounded-xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
              required 
            />
            <select 
              name="category" 
              className="w-full bg-background border border-input rounded-xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">
                <span>Уровень владения</span>
                <span className="text-primary">Мастерство</span>
              </div>
              <input 
                name="level" 
                type="range" 
                min="0" 
                max="100" 
                className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-2" 
              />
            </div>
            <input 
              name="icon" 
              placeholder="Иконка (Lucide: Database, Code2...)" 
              className="w-full bg-background border border-input rounded-xl p-4 text-muted-foreground font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
            />
            <button 
              disabled={loading} 
              className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-2xl font-black uppercase italic transition-all shadow-lg shadow-primary/20 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background outline-none active:scale-[0.98]"
            >
              {loading ? 'Сохранение...' : 'Добавить'}
            </button>
          </form>
        </section>

        {/* Список навыков */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill: any) => (
            <div 
              key={skill.id} 
              className="bg-card text-card-foreground border border-border p-6 rounded-3xl group hover:border-primary/50 transition-all duration-500 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-muted rounded-2xl border border-input group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                  <Terminal size={24} className="text-primary" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                  {skill.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4">{skill.name}</h3>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.4)] transition-all duration-1000 ease-out" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <div className="mt-2 text-right text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-tighter">
                Опыт: {skill.level}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}