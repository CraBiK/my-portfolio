'use client'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-xl bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background outline-none active:scale-95"
      aria-label="Переключить тему"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      <span className="sr-only">Переключить тему</span>
    </button>
  )
}