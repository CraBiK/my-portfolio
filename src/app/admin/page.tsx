'use client';
import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  // Функция сохранения настроек дизайна (Цвета)
  async function updateTheme(color: string) {
    await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ key: 'primary_color', value: color }),
    });
    alert('Цвет сайта изменен!');
    window.location.reload(); // Чтобы обновить тему
  }

  // Функция добавления проекта
  async function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const file = formData.get('image') as File;

    // 1. Грузим в Blob
    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    // 2. Сохраняем в SQL
    await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('title'),
        image_url: blob.url,
      }),
    });

    setLoading(false);
    alert('Проект добавлен!');
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans">
      <h1 className="text-3xl font-black mb-10 text-slate-900">Advanced Admin CMS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Модуль Дизайна */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Настройки Дизайна</h2>
          <p className="text-sm text-slate-500 mb-4">Выберите основной цвет вашего портфолио</p>
          <div className="flex gap-2">
            {['#000000', '#2563eb', '#16a34a', '#dc2626', '#7c3aed'].map((color) => (
              <button 
                key={color}
                onClick={() => updateTheme(color)}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </section>

        {/* Модуль Проектов */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Добавить новый проект</h2>
          <form onSubmit={addProject} className="space-y-4">
            <input name="title" placeholder="Название проекта" className="w-full border p-3 rounded-lg focus:ring-2 ring-slate-200 outline-none" required />
            <div className="border-2 border-dashed border-slate-200 p-4 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition">
              <input name="image" type="file" required className="cursor-pointer" />
            </div>
            <button disabled={loading} className="w-full bg-slate-900 text-white font-bold p-3 rounded-lg hover:opacity-90 transition">
              {loading ? 'Загрузка...' : 'Сохранить проект'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}