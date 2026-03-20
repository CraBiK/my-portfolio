'use client';
import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function AdminProjects() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const file = fd.get('image') as File;

    const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });

    await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: fd.get('title'),
        image_url: blob.url,
        description: fd.get('desc'),
        tech_stack: (fd.get('stack') as string).split(','),
        live_url: fd.get('live'),
        github_url: fd.get('github'),
      })
    });
    alert('Проект опубликован!');
    setLoading(false);
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-black mb-10 text-foreground uppercase italic tracking-tighter">
        Менеджер проектов
      </h2>
      <form onSubmit={handleSubmit} className="bg-card text-card-foreground border border-border p-10 rounded-[2.5rem] space-y-8 shadow-sm">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-muted-foreground ml-2 tracking-widest">
              Название проекта
            </label>
            <input 
              name="title" 
              className="w-full bg-background border border-input rounded-2xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
              placeholder="Интернет-магазин..." 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-muted-foreground ml-2 tracking-widest">
              Стек технологий
            </label>
            <input 
              name="stack" 
              className="w-full bg-background border border-input rounded-2xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
              placeholder="Next.js, TypeScript, Tailwind..." 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-muted-foreground ml-2 tracking-widest">
            Описание
          </label>
          <textarea 
            name="desc" 
            className="w-full h-32 bg-background border border-input rounded-2xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all resize-none" 
            placeholder="Кратко расскажите о проекте..."
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <input 
            name="live" 
            className="bg-background border border-input rounded-2xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
            placeholder="Демо (https://...)" 
          />
          <input 
            name="github" 
            className="bg-background border border-input rounded-2xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
            placeholder="GitHub репозиторий" 
          />
        </div>

        <div className="border-2 border-dashed border-border rounded-3xl p-10 text-center hover:bg-muted hover:border-primary/50 transition-all cursor-pointer relative ring-offset-background focus-within:ring-2 focus-within:ring-ring">
          <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
          <div className="text-foreground font-bold text-lg">Загрузите обложку</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-tighter">
            Рекомендуется: 1920x1080px
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full bg-primary text-primary-foreground hover:opacity-90 py-5 rounded-2xl font-black text-xl uppercase italic transition-all shadow-lg shadow-primary/20 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background outline-none active:scale-[0.98]"
        >
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  );
}