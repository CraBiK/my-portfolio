import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <span className="text-xl font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          Portfolio.26
        </span>
        <div className="flex gap-8 text-sm font-medium uppercase tracking-tighter">
          <a href="#" className="hover:opacity-50 transition">Work</a>
          <a href="#" className="hover:opacity-50 transition">About</a>
          <a href="/admin" className="opacity-20 hover:opacity-100 transition">Admin</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((p) => (
            <div key={p.id} className="group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 mb-6">
                <img 
                  src={p.image_url} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                  alt={p.title} 
                />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase italic">{p.title}</h2>
              <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}