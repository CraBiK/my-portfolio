'use client';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function NavManager() {
  const addLink = async () => {
    const label = prompt('Название:');
    const url = prompt('URL:');
    if(label && url) {
      await fetch('/api/navigation', { method: 'POST', body: JSON.stringify({ label, url }) });
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Навигация</h2>
        <button 
          onClick={addLink} 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <Plus size={18}/> Добавить пункт
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Список ссылок с возможностью удаления */}
        <div className="p-6 bg-card text-card-foreground border border-border rounded-3xl flex items-center gap-6 group hover:border-primary/30 transition-all shadow-sm">
           <GripVertical className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
           <div className="flex-1">
              <div className="text-foreground font-bold">Проекты</div>
              <div className="text-xs text-muted-foreground font-mono">/projects</div>
           </div>
           <button className="text-muted-foreground hover:text-destructive transition-all p-2 rounded-lg hover:bg-destructive/10 outline-none focus-visible:ring-2 focus-visible:ring-destructive">
             <Trash2 size={18}/>
           </button>
        </div>
      </div>
    </div>
  );
}