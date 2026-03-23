"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { StyleEditor } from "@/components/admin/style-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateAllSettings } from "@/actions/settings-actions";
import { StatusToast, type StatusState } from "@/components/custom/status-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Palette, Globe, Layout, Type } from "lucide-react";

export default function SettingsForm({ initialData, initialSeo }: any) {
  const [css, setCss] = useState(initialData.custom_css || "");
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
  const [logoType, setLogoType] = useState(initialData.logo_type || 'svg');
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setLogoUrl(blob.url);
      setStatus({ type: 'success', message: 'Логотип загружен' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Ошибка загрузки файла' });
    } finally { setIsUploading(false); }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateAllSettings({
      header_height: Number(formData.get("header_height")),
      logo_width: Number(formData.get("logo_width")),
      logo_height: Number(formData.get("logo_height")),
      logo_url: logoUrl,
      logo_type: logoType,
      logo_data: formData.get("logo_data") as string,
      logo_custom_style: formData.get("logo_custom_style") as string,
      primary_color: formData.get("primary_color") as string,
      font_family: formData.get("font_family") as string,
      border_radius: formData.get("border_radius") as string,
      custom_css: css,
      site_title: formData.get("site_title") as string,
      site_description: formData.get("site_description") as string,
      footer_text: formData.get("footer_text") as string,
    });
    setIsPending(false);
    setStatus(result.success ? { type: 'success', message: 'Все настройки сохранены!' } : { type: 'error', message: result.error });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-5xl pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SEO & Text */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Globe className="size-4 text-primary" /> SEO и Контент
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок сайта</Label>
              <Input name="site_title" defaultValue={initialSeo?.title} />
            </div>
            <div className="space-y-2">
              <Label>Мета-описание</Label>
              <Textarea name="site_description" className="h-20" defaultValue={initialSeo?.description} />
            </div>
            <div className="space-y-2">
              <Label>Текст в футере</Label>
              <Input name="footer_text" defaultValue={initialData.footer_text} />
            </div>
          </CardContent>
        </Card>

        {/* Дизайн токены */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Palette className="size-4 text-primary" /> Дизайн-система
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Акцентный цвет</Label>
                <div className="flex gap-2">
                  <Input name="primary_color" type="color" className="w-12 p-1 h-8" defaultValue={initialData.primary_color} />
                  <Input name="primary_color_hex" className="font-mono text-xs" value={initialData.primary_color} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Скругление (px/rem)</Label>
                <Input name="border_radius" defaultValue={initialData.border_radius} placeholder="12px" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Шрифт</Label>
              <select name="font_family" defaultValue={initialData.font_family} className="w-full h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="var(--font-sans)">Montserrat (Sans)</option>
                <option value="var(--font-serif)">Nunito (Serif)</option>
                <option value="system-ui">System UI</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Размеры Layout */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Layout className="size-4 text-primary" /> Разметки и Логотип
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
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

            <div className="space-y-4 pt-4 border-t">
              <div className="flex gap-4 p-1 bg-muted rounded-xl w-fit">
                {['svg', 'image'].map((t) => (
                  <Button key={t} type="button" variant={logoType === t ? 'default' : 'ghost'} size="sm" onClick={() => setLogoType(t)}>
                    {t.toUpperCase()}
                  </Button>
                ))}
              </div>

              {logoType === 'svg' ? (
                <div className="space-y-2">
                  <Label>SVG Код логотипа</Label>
                  <Textarea name="logo_data" className="font-mono text-xs h-32" defaultValue={initialData.logo_data} placeholder="<svg>...</svg>" />
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Изображение логотипа</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <input type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                      {isUploading ? <Loader2 className="animate-spin" /> : <Upload className="text-muted-foreground" />}
                      <span className="text-xs mt-2">Загрузить PNG/JPG</span>
                    </label>
                    {logoUrl && <div className="p-2 border rounded-xl bg-white/5"><img src={logoUrl} className="h-10 object-contain" alt="Preview" /></div>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Custom CSS */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Type className="size-4 text-primary" /> Глобальный CSS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StyleEditor initialValue={css} onChange={(val) => setCss(val || "")} />
          </CardContent>
        </Card>
      </div>

      <StatusToast status={status} onClose={() => setStatus(null)} />
      
      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button type="submit" disabled={isPending} className="shadow-xl px-8 h-12 font-bold uppercase italic tracking-widest">
          {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
          Сохранить конфигурацию
        </Button>
      </div>
    </form>
  );
}