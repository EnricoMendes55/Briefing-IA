"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [text, setText] = useState(value || "#000000");

  useEffect(() => {
    setText(value || "#000000");
  }, [value]);

  function handleTextChange(v: string) {
    setText(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      onChange(v);
    }
  }

  function handlePickerChange(v: string) {
    setText(v);
    onChange(v);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => handlePickerChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-input"
        />
        <Input
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#RRGGBB"
          className="w-32 font-mono"
          maxLength={7}
        />
        <div
          className="h-10 flex-1 rounded border"
          style={{ backgroundColor: value || "#000000" }}
        />
      </div>
    </div>
  );
}
