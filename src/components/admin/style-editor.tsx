"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes"; // Если используешь темную тему

interface StyleEditorProps {
  initialValue: string;
  onChange: (value: string | undefined) => void;
}

export function StyleEditor({ initialValue, onChange }: StyleEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="rounded-md border overflow-hidden">
      <Editor
        height="400px"
        defaultLanguage="css"
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={initialValue}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
