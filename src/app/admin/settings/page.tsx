import { sql } from "@/lib/db";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const [settings] = await sql`SELECT * FROM global_settings WHERE id = 1`;
  const [seo] = await sql`SELECT * FROM seo WHERE page = 'home'`;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Управление сайтом</h1>
      <SettingsForm initialData={settings} initialSeo={seo} />
    </div>
  );
}
