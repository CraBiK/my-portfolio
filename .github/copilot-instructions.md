# Правила разработки (для Gemini Code Assist)

## Стек:
- Next.js 16.2+, React 19, Tailwind CSS v4, Sanity v3, Prisma, Neon.

## Критические запреты:
1. НИКАКИХ HEX-цветов (напр. #ffffff). Используйте только переменные shadcn/ui (bg-background, text-primary).
2. Версии: Только App Router и Server Actions. Не используйте старые API-роуты.
3. Безопасность: Не пытайтесь читать файлы, указанные в .aiexclude.
