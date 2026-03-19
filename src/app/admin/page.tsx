'use client';
import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function AdvancedAdmin() {
  const [loading, setLoading] = useState(false);

  // Смена цвета (Design System)
  const updateColor = async (color: string) => {
    await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ key: 'primary_color', value: color })
    });
    window.location.reload();
  };

  // Загрузка проекта
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const file = fd.get('image') as File;

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: fd.get('title'),
          image_url: blob.url,
          description: fd.get('desc')
        })
      });
      alert("Успех!");
    } catch (err) { alert("Ошибка загрузки"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter italic">CMS v6.0</h1>
        <div className="flex gap-2 bg-white p-2 rounded-full border shadow-sm">
          {['#000000', '#2563eb', '#7c3aed', '#db2777', '#ea580c'].map(c => (
            <button 
              key={c} 
              onClick={() => updateColor(c)}
              className="w-8 h-8 rounded-full border-2 border-slate-100 hover:scale-110 transition"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6">Новый проект</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Название проекта" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500" required />
            <textarea name="desc" placeholder="Описание" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500 h-32" />
            <div className="relative h-40 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
              <span className="text-slate-400 font-medium">Кликните для выбора скриншота</span>
            </div>
            <button disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition disabled:opacity-50">
              {loading ? 'СОХРАНЕНИЕ...' : 'ОПУБЛИКОВАТЬ В ПОРТФОЛИО'}
            </button>
          </form>
        </section>

        <aside className="space-y-8">
          <div className="bg-black text-white p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-2">Статус системы</h3>
            <p className="text-slate-400 text-sm">База: Neon Postgres 17</p>
            <p className="text-slate-400 text-sm">Хранилище: Vercel Blob</p>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[100%]" />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}