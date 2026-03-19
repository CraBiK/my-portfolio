import postgres from 'postgres';

// Оптимизированный коннект для Serverless среды
const connectionString = process.env.POSTGRES_URL!;
export const sql = postgres(connectionString, { ssl: 'require' });

// Хелпер для получения одной настройки
export async function getSetting(key: string, defaultValue: string = '') {
  const [setting] = await sql`SELECT value FROM settings WHERE key = ${key}`;
  return setting?.value || defaultValue;
}