'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- КОМПОНЕНТ СОРТИРУЕМОГО ПУНКТА ---
function SortableNavItem({ item, onDelete }: { item: any, onDelete: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`p-6 bg-card text-card-foreground border border-border rounded-3xl flex items-center gap-6 group transition-all shadow-sm ${isDragging ? 'opacity-50 scale-[1.02] border-primary shadow-xl' : 'hover:border-primary/30'}`}
    >
       {/* Хэндл для перетаскивания */}
       <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
          <GripVertical className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
       </div>

       <div className="flex-1">
          <div className="text-foreground font-bold uppercase tracking-tight text-sm">{item.label}</div>
          <div className="text-[10px] text-muted-foreground font-mono opacity-60 italic">{item.url}</div>
       </div>

       <button 
         onClick={() => onDelete(item.id)}
         className="text-muted-foreground hover:text-destructive transition-all p-2 rounded-lg hover:bg-destructive/10 outline-none focus-visible:ring-2 focus-visible:ring-destructive"
       >
         <Trash2 size={18}/>
       </button>
    </div>
  );
}

// --- ОСНОВНАЯ СТРАНИЦА ---
export default function NavManager() {
  const [items, setItems] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadNav = () => fetch('/api/navigation').then(res => res.json()).then(setItems);
  useEffect(() => { loadNav(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder); // Мгновенное обновление UI

      // Сохраняем новый порядок в БД
      const updateData = newOrder.map((item, index) => ({
        id: item.id,
        order_index: index + 1
      }));

      await fetch('/api/navigation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updateData })
      });
    }
  };

  const addLink = async () => {
    const label = prompt('Название:');
    const url = prompt('URL (напр. /about):');
    if(label && url) {
      await fetch('/api/navigation', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, url }) 
      });
      loadNav();
    }
  };

  const deleteLink = async (id: number) => {
    if (confirm('Удалить пункт?')) {
      await fetch('/api/navigation', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }) 
      });
      loadNav();
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Навигация</h2>
        <button onClick={addLink} className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus size={18}/> Добавить пункт
        </button>
      </div>
      
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableNavItem key={item.id} item={item} onDelete={deleteLink} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}