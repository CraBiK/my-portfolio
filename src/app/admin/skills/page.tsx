'use client';
import { useState, useEffect } from 'react';
import { Cpu, Plus, Zap, Code2, Database, Terminal } from 'lucide-react';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['Frontend', 'Backend', 'DevOps', 'Tools', 'Design'];

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
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Skills Matrix</h1>
          <p className="text-slate-500 mt-2">Визуализация вашего технологического арсенала</p>
        </div>
        <div className="text-indigo-500 font-mono text-sm">Total Skills: {skills.length}</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Форма добавления (Shadcn styled) */}
        <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2.5rem] h-fit sticky top-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-indigo-500" size={20}/> Добавить навык
          </h2>
          <form onSubmit={addSkill} className="space-y-5">
            <input name="name" placeholder="Название (напр. React)" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:ring-2 ring-indigo-500" required />
            <select name="category" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:ring-2 ring-indigo-500">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                <span>Уровень владения</span>
                <span className="text-indigo-400">Mastery</span>
              </div>
              <input name="level" type="range" min="0" max="100" className="w-full accent-indigo-600 bg-white/5 rounded-lg appearance-none cursor-pointer" />
            </div>
            <input name="icon" placeholder="Иконка (Lucide name: Database, Code2...)" className="w-full bg-black border border-white/10 rounded-xl p-4 text-slate-400 font-mono text-sm" />
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(79,70,229,0.2)]">
              {loading ? 'СОХРАНЕНИЕ...' : 'ДОБАВИТЬ В МАТРИЦУ'}
            </button>
          </form>
        </section>

        {/* Список навыков (Grid of Cards) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill: any) => (
            <div key={skill.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl group hover:border-indigo-500/50 transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-black rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                  <Terminal size={24} className="text-indigo-400" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full uppercase tracking-widest">
                  {skill.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{skill.name}</h3>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <div className="mt-2 text-right text-[10px] font-mono text-slate-600 uppercase">
                Expertise: {skill.level}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}