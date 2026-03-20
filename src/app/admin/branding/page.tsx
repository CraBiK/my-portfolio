'use client';
import { useState } from 'react';
import { upload } from '@vercel/blob/client'; 
import { 
  Palette, 
  LayoutDashboard, 
  Rocket, 
  FileText, 
  Layers, 
  Shield, 
  Settings,
	Upload, 
	Loader2, 
	ImageIcon	
} from 'lucide-react';

export default function BrandingPage() {
  const [logoType, setLogoType] = useState('svg');

	const [isUploading, setIsUploading] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');

  const save = async (key: string, value: string) => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ key, value }) });
    alert(`Настройка сохранена: ${key}`);
  };

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Загружаем файл в облако Vercel Blob
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload', // Твой существующий роут
      });

      // 2. Сохраняем URL в базу данных
      await save('logo_image_url', newBlob.url);
      await save('logo_type', 'image'); // Помечаем, что теперь используем картинку
      
      setCurrentLogoUrl(newBlob.url);
      alert('Логотип-картинка сохранен!');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight uppercase italic">Брендинг и дизайн</h1>
        <p className="text-muted-foreground font-medium">Управление визуальным стилем вашего портфолио</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Цвета */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Palette className="text-primary" size={20}/> Акцентные цвета
            </h2>
            <div className="flex flex-wrap gap-6">
              {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map(color => (
                <button 
                  key={color} 
                  onClick={() => save('primary_color', color)}
                  className="w-16 h-16 rounded-3xl border-2 border-border hover:border-primary hover:scale-110 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background outline-none"
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="flex items-center gap-4 ml-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Свой HEX:</span>
                <input 
                  type="text" 
                  className="bg-background border border-input rounded-xl px-4 py-2 w-32 font-mono text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none transition-all" 
                  onBlur={(e) => save('primary_color', e.target.value)} 
                />
              </div>
            </div>
          </section>

          <section className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] shadow-sm space-y-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Palette className="text-primary" size={20}/> Токены дизайна
            </h2>

            {/* Выбор шрифта */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Системный шрифт</label>
              <select 
                className="w-full bg-background border border-input rounded-xl p-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                onChange={(e) => save('font_family', e.target.value)}
              >
                <option value="Geist Sans">Geist Sans (Современный)</option>
                <option value="Inter">Inter (Чистый)</option>
                <option value="JetBrains Mono">JetBrains Mono (Для кода)</option>
                <option value="Space Grotesk (Технологичный)">Space Grotesk (Tech)</option>
              </select>
            </div>

            {/* Закругление углов */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Радиус интерфейса</label>
              <div className="flex gap-4">
                {['0px', '8px', '16px', '32px'].map(r => (
                  <button 
                    key={r}
                    onClick={() => save('border_radius', r)}
                    className="flex-1 py-3 bg-muted border border-input rounded-xl hover:border-primary hover:bg-accent hover:text-accent-foreground transition-all text-xs font-bold focus-visible:ring-2 focus-visible:ring-ring outline-none"
                  >
                    {r === '0px' ? 'Острый' : r}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Логотип */}
          <section className="bg-card text-card-foreground border border-border p-8 rounded-[2rem] shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-foreground">Настройка логотипа</h2>
            <div className="space-y-6">
          {/* Переключатель */}
          <div className="flex gap-4 p-1 bg-muted rounded-2xl w-fit">
            <button 
              onClick={() => { setLogoType('svg'); save('logo_type', 'svg'); }} 
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${logoType === 'svg' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              SVG-код
            </button>
            <button 
              onClick={() => { setLogoType('image'); save('logo_type', 'image'); }} 
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${logoType === 'image' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Изображение (PNG/JPG)
            </button>
          </div>

          {logoType === 'svg' ? (
            <textarea 
              className="w-full h-48 bg-background border border-input rounded-2xl p-6 font-mono text-primary text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              placeholder="Вставьте SVG-код..."
              onBlur={(e) => save('logo_data', e.target.value)}
            />
          ) : (
            <div className="space-y-4">
              {/* Поле загрузки */}
              <label className="relative border-2 border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center hover:bg-muted hover:border-primary/50 transition-all cursor-pointer group">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  accept="image/*"
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <Loader2 className="animate-spin text-primary mb-4" size={32} />
                ) : (
                  <Upload className="text-muted-foreground group-hover:text-primary mb-4" size={32} />
                )}
                
                <span className="font-bold text-foreground">
                  {isUploading ? 'Загрузка...' : 'Выбрать PNG или JPG'}
                </span>
                <span className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">Макс. 4MB</span>
              </label>

              {/* Мини-превью загруженного логотипа */}
              {currentLogoUrl && (
                <div className="p-4 bg-muted rounded-2xl flex items-center justify-center border border-border">
                  <img src={currentLogoUrl} alt="Preview" className="h-12 object-contain" />
                </div>
              )}
            </div>
          )}
        </div>
          </section>
        </div>

        {/* Инфо-панель */}
        <aside className="bg-primary p-8 rounded-[2rem] text-primary-foreground flex flex-col justify-between shadow-lg shadow-primary/20">
          <div>
            <h3 className="text-2xl font-black mb-4 uppercase italic">Предпросмотр</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed font-medium">
              Изменения применяются мгновенно без перезагрузки сайта через Server-side Styles Injection.
            </p>
          </div>
          <div className="mt-20">
            <span className="text-[10px] uppercase tracking-widest font-black opacity-60">Статус</span>
            <div className="text-lg font-bold">Система активна</div>
          </div>
        </aside>
      </div>
    </div>
  );
}