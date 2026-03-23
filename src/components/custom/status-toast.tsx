"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Выносим типы, чтобы их было удобно импортировать в формы
export type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

interface StatusToastProps {
  status: StatusState;
  onClose: () => void;
  autoCloseDelay?: number;
}

export function StatusToast({ 
  status, 
  onClose, 
  autoCloseDelay = 3000 
}: StatusToastProps) {
  
  // Автоматическое закрытие только для успеха
  useEffect(() => {
    if (status?.type === "success" && autoCloseDelay > 0) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [status, onClose, autoCloseDelay]);

  if (!status) return null;

  const isSuccess = status.type === "success";

  return (
    <div className="fixed bottom-24 right-8 z-[100] flex flex-col items-end gap-2 pointer-events-none">
      <div
        onClick={onClose}
        className={cn(
          "px-4 py-2 rounded-md shadow-xl border text-sm transition-all cursor-pointer pointer-events-auto",
          "animate-in fade-in slide-in-from-bottom-3 duration-300",
          // Семантические цвета из твоего .cursorrules
          isSuccess
            ? "bg-success border-success text-success-foreground"
            : "bg-destructive/10 border-destructive/30 text-destructive font-medium"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">
            {isSuccess ? "✓" : "!"}
          </span>
          <p>{status.message}</p>
          {!isSuccess && (
            <span className="ml-2 text-[10px] opacity-40 hover:opacity-100">✕</span>
          )}
        </div>
      </div>
    </div>
  );
}
