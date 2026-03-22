"use client";

import { useState } from "react";
import { StyleEditor } from "@/components/admin/style-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateAllSettings } from "@/actions/settings-actions";
import { StatusToast, type StatusState } from "@/components/custom/status-toast";
import { toast } from "sonner"; // Если используешь sonner для уведомлений

export default function SettingsForm({ initialData, initialSeo }: any) {
  const [css, setCss] = useState(initialData.custom_css || "");
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus(null);

    const result = await updateAllSettings({
      header_height: Number(formData.get("header_height")),
      logo_width: Number(formData.get("logo_width")),
      logo_height: Number(formData.get("logo_height")),
      logo_url: formData.get("logo_url") as string,
      logo_custom_style: formData.get("logo_custom_style") as string,
      custom_css: css,
      site_title: formData.get("site_title") as string,
      site_description: formData.get("site_description") as string,
    });

    setIsPending(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Настройки сохранены!' });
      setTimeout(() => setStatus(null), 3000);
    } else { 
      setStatus({ type: 'error', message: result.error || 'Ошибка сохранения' });
    }
  }
  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl pb-20">
      {/* Секция SEO */}
      <section className="space-y-4 border p-4 rounded-lg bg-card">
        <h2 className="text-xl font-semibold">SEO Главной страницы</h2>
        <div className="space-y-2">
          <Label>Заголовок (Title)</Label>
          <Input name="site_title" defaultValue={initialSeo?.title} />
        </div>
        <div className="space-y-2">
          <Label>Описание (Description)</Label>
          <Textarea name="site_description" defaultValue={initialSeo?.description} />
        </div>
      </section>

      {/* Секция Размеров */}
      <section className="space-y-4 border p-4 rounded-lg bg-card">
        <h2 className="text-xl font-semibold">Размеры и Логотип</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Высота шапки (px)</Label>
            <Input name="header_height" type="number" defaultValue={initialData.header_height} />
          </div>
          <div className="space-y-2">
            <Label>Ширина лого (px)</Label>
            <Input name="logo_width" type="number" defaultValue={initialData.logo_width} />
          </div>
          <div className="space-y-2">
            <Label>Высота лого (px)</Label>
            <Input name="logo_height" type="number" defaultValue={initialData.logo_height} />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <Label>URL Логотипа</Label>
          <Input name="logo_url" defaultValue={initialData.logo_url} />
        </div>
        <div className="space-y-2">
          <Label>Кастомный инлайн стиль лого (CSS)</Label>
          <Input name="logo_custom_style" defaultValue={initialData.logo_custom_style} placeholder="filter: grayscale(1);" />
        </div>
      </section>

      {/* Секция Custom CSS */}
      <section className="space-y-4 border p-4 rounded-lg bg-card">
        <h2 className="text-xl font-semibold">Глобальный CSS (Monaco Editor)</h2>
        <StyleEditor initialValue={css} onChange={(val) => setCss(val || "")} />
      </section>

      <StatusToast status={status} onClose={() => setStatus(null)} />
      
      <Button type="submit" disabled={isPending} className="fixed bottom-8 right-8 shadow-lg">
        {isPending ? "Сохранение..." : "Сохранить всё"}
      </Button>
    </form>
  );
}
