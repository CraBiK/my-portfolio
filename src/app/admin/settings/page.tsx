import { sql } from '@/lib/db';
import SettingsForm from './settings-form'; // Вынесем саму форму в клиентский компонент

export default async function SettingsPage() {
  // 1. Читаем настройки прямо на сервере
  const [settings] = await sql`SELECT * FROM global_settings WHERE id = 1`;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Настройки сайта</h1>
      {/* Передаем данные в клиентскую форму */}
      <SettingsForm initialData={settings} />
    </div>
  );
}
