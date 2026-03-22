'use client'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 border border-border rounded-full g-background hover:bg-accent hover:text-accent-foreground transition-all"
      aria-label="Переключить тему"
    >
      <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute top-2 left-2 h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      <span className="sr-only">Переключить тему</span>
    </button>
  )
}