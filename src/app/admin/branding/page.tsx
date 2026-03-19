'use client';
import { useState } from 'react';

export default function BrandingPage() {
  const [logoType, setLogoType] = useState('svg');

  const save = async (key: string, value: string) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ key, value }) });
    alert(`Настройка ${key} сохранена!`);
  };

  return (
    <div className="max-w-5xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Identity & Design</h1>
        <p className="text-slate-500">Управление визуальным брендом вашего портфолио</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Цвета */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2rem] shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="text-indigo-500"/> Акцентные цвета
            </h2>
            <div className="flex flex-wrap gap-6">
              {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map(color => (
                <button 
                  key={color} 
                  onClick={() => save('primary_color', color)}
                  className="w-16 h-16 rounded-3xl border-4 border-white/10 hover:scale-110 transition shadow-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm font-mono text-slate-400">Custom HEX:</span>
                <input type="text" className="bg-black border border-white/10 rounded-xl px-4 py-2 w-32 font-mono" onBlur={(e) => save('primary_color', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Логотип */}
          <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2rem] shadow-xl">
            <h2 className="text-xl font-bold mb-6">Конфигурация Логотипа</h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-1 bg-black rounded-2xl w-fit">
                <button onClick={() => setLogoType('svg')} className={`px-6 py-2 rounded-xl text-sm font-bold ${logoType === 'svg' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>SVG Код</button>
                <button onClick={() => setLogoType('image')} className={`px-6 py-2 rounded-xl text-sm font-bold ${logoType === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Изображение</button>
              </div>
              <textarea 
                className="w-full h-48 bg-black border border-white/10 rounded-2xl p-6 font-mono text-indigo-400 outline-none focus:ring-2 ring-indigo-500/50"
                placeholder="Вставьте <svg> код вашего логотипа..."
                onBlur={(e) => save('logo_data', e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* Инфо-панель */}
        <aside className="bg-indigo-600 p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-[0_0_50px_rgba(79,70,229,0.2)]">
          <div>
            <h3 className="text-2xl font-black mb-4">Live Preview</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">Все изменения применяются мгновенно без пересборки сайта (Server-side Styles Injection).</p>
          </div>
          <div className="mt-20">
            <span className="text-xs uppercase tracking-widest font-bold opacity-50">Status</span>
            <div className="text-lg font-bold">Система активна</div>
          </div>
        </aside>
      </div>
    </div>
  );
}