'use client';
import { useState } from 'react';

export default function AppearancePage() {
  const save = async (key: string, value: string) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ key, value }) });
    alert(`Настройка ${key} обновлена`);
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-black text-white mb-12 tracking-tighter italic">Appearance Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Логотип */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-6">
          <h3 className="text-xl font-bold text-white">Логотип сайта</h3>
          <div className="p-4 bg-black rounded-2xl border border-white/10 min-h-[100px] flex items-center justify-center">
             {/* Превью лого */}
             <span className="text-xs text-slate-600 italic">Preview Mode</span>
          </div>
          <textarea 
            className="w-full h-40 bg-black border border-white/10 rounded-2xl p-4 font-mono text-indigo-400 text-xs"
            placeholder="Вставьте SVG код логотипа..."
            onBlur={(e) => save('logo_data', e.target.value)}
          />
        </section>

        {/* Цвета и Тема */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-8">
          <h3 className="text-xl font-bold text-white">Design System</h3>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-4 block">Акцентный цвет</label>
            <div className="flex flex-wrap gap-4">
              {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map(c => (
                <button key={c} onClick={() => save('primary_color', c)} className="w-12 h-12 rounded-2xl border-2 border-white/10" style={{backgroundColor: c}} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-4 block">Шрифт системы</label>
            <select className="w-full bg-black border border-white/10 rounded-xl p-4 text-white" onChange={(e) => save('font_family', e.target.value)}>
              <option value="Geist Sans">Geist Sans (Vercel Style)</option>
              <option value="Inter">Inter (Standard)</option>
              <option value="JetBrains Mono">JetBrains Mono (Dev Style)</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}