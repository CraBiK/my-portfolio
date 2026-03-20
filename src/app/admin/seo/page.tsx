'use client';

export default function SeoManager() {
  const save = async (key: string, value: string) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ key, value }) });
  };

  return (
    <div className="max-w-4xl space-y-10">
      <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
        SEO и глобальные скрипты
      </h2>
      
      <div className="bg-card text-card-foreground border border-border p-10 rounded-[2.5rem] space-y-8 shadow-sm">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">
            Google Analytics ID
          </label>
          <input 
            className="w-full bg-background border border-input rounded-2xl p-4 text-primary font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all" 
            placeholder="G-XXXXXXXX" 
            onBlur={(e) => save('ga_id', e.target.value)} 
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">
            Глобальное мета-описание
          </label>
          <textarea 
            className="w-full bg-background border border-input rounded-2xl p-4 text-foreground h-32 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background transition-all resize-none" 
            placeholder="Введите описание для поисковых систем..."
            onBlur={(e) => save('seo_description', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
}