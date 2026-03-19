'use client';

export default function SeoManager() {
  const save = async (key: string, value: string) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ key, value }) });
  };

  return (
    <div className="max-w-4xl space-y-10">
      <h2 className="text-3xl font-black text-white">SEO & Global Scripts</h2>
      
      <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-8">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Google Analytics ID</label>
          <input className="w-full bg-black border border-white/10 rounded-2xl p-4 text-indigo-400 font-mono" placeholder="G-XXXXXXXX" onBlur={(e) => save('ga_id', e.target.value)} />
        </div>
        
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Global Meta Description</label>
          <textarea className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white h-32" onBlur={(e) => save('seo_description', e.target.value)} />
        </div>
      </div>
    </div>
  );
}