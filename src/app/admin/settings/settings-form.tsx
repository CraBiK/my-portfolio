"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { StyleEditor } from "@/components/admin/style-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateAllSettings } from "@/actions/settings-actions";
import { StatusToast, type StatusState } from "@/components/custom/status-toast";
import { Loader2, Upload, ImageIcon, Layout, Globe, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsForm({ initialData, initialSeo }: any) {
  const [css, setCss] = useState(initialData.custom_css || "");
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
  
  const [logoType, setLogoType] = useState<'image' | 'svg'>('image');
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
      setStatus({ type: 'success', message: 'Файл загружен' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Ошибка загрузки' });
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
      custom_css: css,
      site_title: formData.get("site_title") as string,
      site_description: formData.get("site_description") as string,
      footer_text: formData.get("footer_text") as string,
    });
    setIsPending(false);
    setStatus(result.success ? { type: 'success', message: 'Конфигурация сохранена' } : { type: 'error', message: result.error });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-6xl pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* БЛОК 1: SEO И КОНТЕНТ (Слева) */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Globe className="size-4 text-primary" /> SEO и футер
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 flex-1">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Заголовок (Title)</Label>
              <Input name="site_title" defaultValue={initialSeo?.title} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Описание (Meta Description)</Label>
              <Textarea name="site_description" className="min-h-[100px] resize-none" defaultValue={initialSeo?.description} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Текст в подвале (Footer)</Label>
              <Input name="footer_text" defaultValue={initialData.footer_text} />
            </div>
          </CardContent>
        </Card>

        {/* БЛОК 2: РАЗМЕРЫ И ЛОГОТИП (Справа, на месте Дизайн-системы) */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Layout className="size-4 text-primary" /> Разметки и Логотип
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 flex-1">
            {/* Сетка размеров — компактно в ряд */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Header (px)</Label>
                <Input name="header_height" type="number" defaultValue={initialData.header_height} className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Width (px)</Label>
                <Input name="logo_width" type="number" defaultValue={initialData.logo_width} className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Height (px)</Label>
                <Input name="logo_height" type="number" defaultValue={initialData.logo_height} className="h-8" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Формат логотипа</Label>
              <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                <Button 
                  type="button" 
                  variant={logoType === 'image' ? 'default' : 'ghost'} 
                  size="xs" 
                  className="px-6 py-2 rounded-xl text-xs font-bold transition-all"
                  onClick={() => setLogoType('image')}
                >IMG</Button>
                <Button 
                  type="button" 
                  variant={logoType === 'svg' ? 'default' : 'ghost'} 
                  size="xs" 
                  className="px-6 py-2 rounded-xl text-xs font-bold transition-all"
                  onClick={() => setLogoType('svg')}
                >SVG</Button>
              </div>
            </div>

            {/* Область логотипа — ВСЕГДА открыта для активного типа */}
            <div className="border border-dashed rounded-xl p-4 bg-muted/10">
              {logoType === 'image' ? (
                <div className="flex items-center gap-4">
                  <label className="flex-1 border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group">
                    <input type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                    {isUploading ? (
                      <Loader2 className="animate-spin text-primary" size={20} />
                    ) : (
                      <>
                        <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                        <span className="text-[10px] font-bold mt-2 uppercase">Загрузить файл</span>
                      </>
                    )}
                  </label>
                  {logoUrl && (
                    <div className="p-2 border rounded-lg bg-card shadow-sm shrink-0">
                      <img src={logoUrl} className="h-12 w-12 object-contain" alt="Logo preview" />
                    </div>
                  )}
                </div>
              ) : (
                <Textarea 
                  name="logo_data" 
                  className="font-mono text-[10px] h-28 bg-background resize-none" 
                  defaultValue={initialData.logo_data} 
                  placeholder="<svg>...</svg>" 
                />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Logo CSS Style</Label>
              <Input name="logo_custom_style" className="h-8 font-mono text-[11px]" defaultValue={initialData.logo_custom_style} placeholder="filter: invert(1);" />
            </div>
          </CardContent>
        </Card>

        {/* БЛОК 3: CUSTOM CSS (Ниже на всю ширину) */}
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Code2 className="size-4 text-primary" /> Глобальный CSS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <StyleEditor initialValue={css} onChange={(val) => setCss(val || "")} />
          </CardContent>
        </Card>
      </div>

      <StatusToast status={status} onClose={() => setStatus(null)} />
      
      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button 
          type="submit" 
          disabled={isPending} 
          className="fixed bottom-8 right-8 shadow-lg"
        >
          {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
          Сохранить
        </Button>
      </div>
    </form>
  );
}