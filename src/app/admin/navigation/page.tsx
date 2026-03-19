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
        <h2 className="text-3xl font-black text-white">Menu Structure</h2>
        <button onClick={addLink} className="bg-indigo-600 px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2 hover:bg-indigo-500 transition">
          <Plus size={18}/> Добавить пункт
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Список ссылок с возможностью удаления */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6 group hover:border-white/20 transition">
           <GripVertical className="text-slate-700 group-hover:text-slate-500" />
           <div className="flex-1">
              <div className="text-white font-bold">Projects</div>
              <div className="text-xs text-slate-600">/projects</div>
           </div>
           <button className="text-slate-700 hover:text-red-500 transition"><Trash2 size={18}/></button>
        </div>
      </div>
    </div>
  );
}