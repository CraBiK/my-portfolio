'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, ExternalLink, Trash2 } from 'lucide-react';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  
  const loadPages = () => fetch('/api/pages').then(res => res.json()).then(setPages);
  useEffect(() => { loadPages(); }, []);

  const createPage = async () => {
    const title = prompt('Заголовок страницы:');
    const slug = prompt('URL-путь (например, about):');
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
        <h1 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
          Страницы сайта
        </h1>
        <button 
          onClick={createPage} 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none ring-offset-background"
        >
          <Plus size={18}/> Создать страницу
        </button>
      </header>

      <div className="grid gap-4">
        {pages.map((page: any) => (
          <div 
            key={page.id} 
            className="bg-card text-card-foreground border border-border p-6 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-xl border border-input text-muted-foreground">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-foreground font-bold">{page.title}</h3>
                <span className="text-xs text-muted-foreground font-mono">/{page.slug}</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={`/${page.slug}`} 
                target="_blank" 
                className="p-2 text-muted-foreground hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <ExternalLink size={18}/>
              </a>
              <button 
                className="p-2 text-muted-foreground hover:text-destructive transition-colors outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-lg"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}