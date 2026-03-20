import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// Получение списка меню
export async function GET() {
  const nav = await sql`SELECT * FROM navigation ORDER BY order_index ASC`;
  return NextResponse.json(nav);
}

// Добавление нового пункта
export async function POST(req: Request) {
  try {
    const { label, url } = await req.json();
    
    // Считаем текущее кол-во элементов, чтобы выставить order_index в конец
    const countRes = await sql`SELECT count(*) FROM navigation`;
    const nextOrder = parseInt(countRes[0].count) + 1;

    await sql`
      INSERT INTO navigation (label, url, order_index) 
      VALUES (${label}, ${url}, ${nextOrder})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Nav API Error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении" }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    const { items } = await req.json(); // Ожидаем массив [{id, order_index}, ...]
    
    // Выполняем транзакцию обновления для каждого элемента
    for (const item of items) {
      await sql`
        UPDATE navigation 
        SET order_index = ${item.order_index} 
        WHERE id = ${item.id}
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сортировки" }, { status: 500 });
  }
}
// Удаление пункта
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await sql`DELETE FROM navigation WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}