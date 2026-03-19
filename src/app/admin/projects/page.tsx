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
      <h2 className="text-3xl font-black mb-10 text-white">Project Showcase Manager</h2>
      <form onSubmit={handleSubmit} className="bg-[#0f0f0f] border border-white/5 p-10 rounded-[2.5rem] space-y-8 shadow-2xl">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 ml-2">Название проекта</label>
            <input name="title" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-indigo-500" placeholder="E-commerce Platform..." required />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 ml-2">Стек (через запятую)</label>
            <input name="stack" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Next.js, TypeScript, Tailwind..." />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500 ml-2">Описание</label>
          <textarea name="desc" className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Расскажите о проекте..."></textarea>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <input name="live" className="bg-black border border-white/10 rounded-2xl p-4 text-white" placeholder="Live Link (https://...)" />
          <input name="github" className="bg-black border border-white/10 rounded-2xl p-4 text-white" placeholder="GitHub Link" />
        </div>

        <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 text-center hover:bg-white/5 transition cursor-pointer relative">
          <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
          <div className="text-slate-400 font-bold text-lg">Загрузите обложку проекта</div>
          <div className="text-xs text-slate-600 mt-2">Рекомендуемое разрешение: 1920x1080px</div>
        </div>

        <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-[0_10px_40px_rgba(79,70,229,0.3)] disabled:opacity-50">
          {loading ? 'ПУБЛИКАЦИЯ В ОБЛАКО...' : 'ОПУБЛИКОВАТЬ ПРОЕКТ'}
        </button>
      </form>
    </div>
  );
}