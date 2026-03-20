'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, ExternalLink, Trash2 } from 'lucide-react';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  
  const loadPages = () => fetch('/api/pages').then(res => res.json()).then(setPages);
  useEffect(() => { loadPages(); }, []);

  const createPage = async () => {
    const title = prompt('Заголовок страницы:');
    const slug = prompt('URL путь (напр. about):');
    if (title && slug) {
      await fetch('/api/pages', { 
        method: 'POST', 
        body: JSON.stringify({ title, slug, content: '{"blocks": []}' }) 
      });
      loadPages();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">Site Pages</h1>
        <button onClick={createPage} className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition">
          <Plus size={18}/> Создать страницу
        </button>
      </header>

      <div className="grid gap-4">
        {pages.map((page: any) => (
          <div key={page.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl border border-white/5 text-slate-500">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold">{page.title}</h3>
                <span className="text-xs text-slate-600 font-mono">/{page.slug}</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <a href={`/${page.slug}`} target="_blank" className="p-2 hover:text-indigo-400"><ExternalLink size={18}/></a>
              <button className="p-2 hover:text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}