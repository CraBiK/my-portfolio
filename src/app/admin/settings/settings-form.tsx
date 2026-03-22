"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // или твой стандартный toast

const globalSettingsSchema = z.object({
  header_height: z.coerce.number().min(20).max(200),
  logo_width: z.coerce.number().min(10).max(500),
  logo_height: z.coerce.number().min(10).max(200),
  logo_url: z.string().url("Введите корректную ссылку (URL)"),
})

type GlobalSettingsValues = z.infer<typeof globalSettingsSchema>

export function SettingsForm({ initialData }: { initialData: GlobalSettingsValues }) {
  const form = useForm<GlobalSettingsValues>({
    resolver: zodResolver(globalSettingsSchema),
    defaultValues: initialData || {
      header_height: 64,
      logo_width: 120,
      logo_height: 40,
      logo_url: "/logo.png",
    },
  })

  async function onSubmit(data: GlobalSettingsValues) {
    try {
      // Здесь будет твой вызов к API или Server Action
      // const response = await updateGlobalSettings(data)
      
      console.log("Сохраняем настройки:", data)
      toast.success("Настройки успешно обновлены")
    } catch (error) {
      toast.error("Ошибка при сохранении")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="header_height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Высота шапки (px)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ширина лого (px)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo_height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Высота лого (px)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL логотипа</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                Ссылка на изображение (например, из Vercel Blob).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Сохранение..." : "Сохранить глобальные настройки"}
        </Button>
      </form>
    </Form>
  )
}
