export default function SkillsGrid({ skills }: { skills: any[] }) {
  return (
    <section className="py-24 max-w-7xl mx-auto px-8">
      <h2 className="text-6xl font-black tracking-tighter mb-20 italic text-white/10 uppercase">
        Tech Stack
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] hover:bg-indigo-600 transition-all duration-500 cursor-default">
            <div className="text-indigo-500 group-hover:text-white transition-colors mb-4">
               {/* Здесь логика рендеринга иконки по имени */}
               <Cpu size={32} strokeWidth={1.5} />
            </div>
            <h4 className="text-white font-bold group-hover:translate-x-1 transition-transform">{skill.name}</h4>
            <div className="absolute bottom-4 right-6 text-[10px] font-black opacity-0 group-hover:opacity-40 transition-opacity text-white">
              {skill.level}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}