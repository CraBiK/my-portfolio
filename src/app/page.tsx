import { sql } from '@vercel/postgres';

export default async function PortfolioPage() {
  const { rows: projects } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;

  return (
    <main className="min-h-screen bg-white">
      {/* Хедер с динамическим цветом текста */}
      <nav className="p-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter" style={{ color: 'var(--primary)' }}>
          MY PORTFOLIO
        </h1>
        <a href="/admin" className="text-sm text-slate-500 hover:underline">Вход для автора</a>
      </nav>

      {/* Сетка проектов */}
      <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl aspect-video bg-slate-100 mb-4">
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
              />
            </div>
            <h3 className="text-lg font-bold group-hover:underline" style={{ color: 'var(--primary)' }}>
              {project.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Кнопка с динамическим фоном */}
      <div className="text-center py-20">
        <button 
          className="px-8 py-3 text-white font-bold rounded-full shadow-xl hover:opacity-90 transition"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Связаться со мной
        </button>
      </div>
    </main>
  );
}