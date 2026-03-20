'use client';
import { useState } from 'react';

export default function AppearancePage() {
  const save = async (key: string, value: string) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ key, value }) });
    alert(`Настройка обновлена: ${key}`);
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-4xl font-black text-foreground mb-12 tracking-tighter italic uppercase">
        Внешний вид
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Логотип */}
        <section className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] space-y-6 shadow-sm">
          <h3 className="text-xl font-bold text-foreground">Логотип сайта</h3>
          <div className="p-4 bg-muted rounded-2xl border border-input min-h-[100px] flex items-center justify-center">
             {/* Превью лого */}
             <span className="text-xs text-muted-foreground italic">Предпросмотр</span>
          </div>
          <textarea 
            className="w-full h-40 bg-background border border-input rounded-2xl p-4 font-mono text-foreground text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none transition-all ring-offset-background"
            placeholder="Вставьте SVG-код логотипа..."
            onBlur={(e) => save('logo_data', e.target.value)}
          />
        </section>

        {/* Цвета и Тема */}
        <section className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] space-y-8 shadow-sm">
          <h3 className="text-xl font-bold text-foreground">Дизайн-система</h3>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-4 block tracking-wider">
              Акцентный цвет
            </label>
            <div className="flex flex-wrap gap-4">
              {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map(c => (
                <button 
                  key={c} 
                  onClick={() => save('primary_color', c)} 
                  className="w-12 h-12 rounded-2xl border-2 border-border hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none transition-all ring-offset-background hover:scale-105 active:scale-95 shadow-sm" 
                  style={{backgroundColor: c}} 
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-4 block tracking-wider">
              Системный шрифт
            </label>
            <select 
              className="w-full bg-background border border-input rounded-xl p-4 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none transition-all ring-offset-background" 
              onChange={(e) => save('font_family', e.target.value)}
            >
              <option value="Geist Sans">Geist Sans (Vercel)</option>
              <option value="Inter">Inter (Стандартный)</option>
              <option value="JetBrains Mono">JetBrains Mono (Для кода)</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}