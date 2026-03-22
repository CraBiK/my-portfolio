"use client";

import {
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import {
  Copy,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { saveMediaRecords, deleteMediaRecords, type MediaRow } from "@/actions/media";
import { StatusToast, type StatusState } from "@/components/custom/status-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось прочитать изображение"));
    };
    img.src = url;
  });
}

type MediaGalleryProps = {
  initialMedia: MediaRow[];
};

export function MediaGallery({ initialMedia }: MediaGalleryProps) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusState>(null);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const anchorIndexRef = useRef<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticMedia, markDeleted] = useOptimistic(
    initialMedia,
    (current, deletedIds: number[]) =>
      current.filter((m) => !deletedIds.includes(m.id))
  );

  useEffect(() => {
    setSelected(new Set());
    anchorIndexRef.current = null;
  }, [initialMedia]);

  const media = optimisticMedia;

  const handleItemClick = useCallback(
    (e: MouseEvent, index: number, id: number) => {
      if (e.shiftKey && anchorIndexRef.current !== null) {
        const from = Math.min(anchorIndexRef.current, index);
        const to = Math.max(anchorIndexRef.current, index);
        setSelected((prev) => {
          const next = new Set(prev);
          for (let i = from; i <= to; i++) {
            const row = media[i];
            if (row) next.add(row.id);
          }
          return next;
        });
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
        anchorIndexRef.current = index;
        return;
      }

      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      anchorIndexRef.current = index;
    },
    [media]
  );

  const processFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      setStatus({ type: "error", message: "Выберите файлы изображений." });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const payload: {
        url: string;
        name: string;
        size: number;
        type: string;
        width: number | null;
        height: number | null;
      }[] = [];

      for (const file of list) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        let width: number | null = null;
        let height: number | null = null;
        try {
          const dim = await getImageDimensions(file);
          width = dim.width;
          height = dim.height;
        } catch {
          width = null;
          height = null;
        }
        payload.push({
          url: blob.url,
          name: file.name,
          size: file.size,
          type: file.type,
          width,
          height,
        });
      }

      const result = await saveMediaRecords(payload);
      if (!result.ok) {
        setStatus({ type: "error", message: result.error });
        return;
      }
      setStatus({ type: "success", message: "Файлы сохранены в галерею." });
      router.refresh();
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Ошибка при загрузке файлов.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onDeleteSelected = () => {
    const ids = [...selected];
    if (!ids.length) return;

    startTransition(async () => {
      markDeleted(ids);
      const result = await deleteMediaRecords(ids);
      if (!result.ok) {
        setStatus({ type: "error", message: result.error });
        router.refresh();
        return;
      }
      setSelected(new Set());
      setStatus({ type: "success", message: "Выбранные элементы удалены." });
      router.refresh();
    });
  };

  const onCopyLinks = async () => {
    const urls = media
      .filter((m) => selected.has(m.id))
      .map((m) => m.url);
    if (!urls.length) return;
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setStatus({ type: "success", message: "Ссылки скопированы в буфер." });
    } catch {
      setStatus({ type: "error", message: "Не удалось скопировать в буфер." });
    }
  };

  const dropHandlers = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files?.length) {
        void processFiles(e.dataTransfer.files);
      }
    },
  };

  return (
    <div className="max-w-6xl space-y-8">
      <header>
        <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight uppercase italic">
          Медиа-галерея
        </h1>
        <p className="text-muted-foreground font-medium">
          Загрузка в Vercel Blob, учёт в Neon. Выбор нескольких через Shift/Ctrl.
        </p>
      </header>

      <label
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-8 py-14 text-center transition-colors",
          "hover:border-primary/50 hover:bg-muted/50 cursor-pointer",
          isUploading && "pointer-events-none opacity-60"
        )}
        {...dropHandlers}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={isUploading}
          onChange={(e) => {
            const f = e.target.files;
            if (f?.length) void processFiles(f);
            e.target.value = "";
          }}
        />
        {isUploading ? (
          <Loader2 className="size-10 text-primary animate-spin" />
        ) : (
          <Upload className="size-10 text-muted-foreground" />
        )}
        <div>
          <span className="font-bold text-foreground">
            Перетащите изображения сюда
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            или нажмите для выбора файлов (несколько сразу)
          </p>
        </div>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Выбрано: {selected.size}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!selected.size || isPending}
          onClick={() => void onCopyLinks()}
        >
          <Copy className="size-4" />
          Копировать ссылки
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={!selected.size || isPending}
          onClick={onDeleteSelected}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Удалить выбранные
        </Button>
      </div>

      {media.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <ImageIcon className="size-12 mx-auto mb-4 opacity-40" />
          <p>Галерея пуста. Загрузите изображения выше.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item, index) => {
            const checked = selected.has(item.id);
            return (
              <li key={item.id}>
                <div
  role="button"
  tabIndex={0}
  className={cn(
    "group relative w-full rounded-xl border border-border bg-card overflow-hidden text-left outline-none transition-shadow cursor-pointer",
    "focus-visible:ring-2 focus-visible:ring-ring",
    checked && "ring-2 ring-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
  )}
  onClick={(e) => handleItemClick(e, index, item.id)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(e as any, index, item.id);
    }
  }}
>
  <div className="absolute left-2 top-2 z-10">
    <Checkbox
      checked={checked}
      onCheckedChange={() => {}} // Состояние управляется через handleItemClick
      aria-label={`Выбрать ${item.name}`}
      className="pointer-events-none bg-background/80 border-border"
    />
  </div>
  
  <div className="aspect-square bg-muted relative">
    <img
      src={item.url}
      alt={item.name}
      className="size-full object-cover"
    />
  </div>

  <div className="p-2 border-t border-border">
    <p className="text-xs font-medium truncate text-foreground" title={item.name}>
      {item.name}
    </p>
    <p className="text-[10px] text-muted-foreground truncate">
      {item.width && item.height
        ? `${item.width}×${item.height}`
        : "—"}
    </p>
  </div>
</div>

              </li>
            );
          })}
        </ul>
      )}

      <StatusToast status={status} onClose={() => setStatus(null)} />
    </div>
  );
}
