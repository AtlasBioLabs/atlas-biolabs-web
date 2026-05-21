"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CoaComboboxInputProps = {
  id?: string;
  label?: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  readOnly?: boolean;
};

export function CoaComboboxInput({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
  helperText,
  className,
  readOnly = false,
}: CoaComboboxInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const datalistId = `${inputId}-options`;

  return (
    <div className="space-y-2">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--brand-navy)]"
        >
          {label}
        </label>
      ) : null}
      <Input
        id={inputId}
        list={readOnly ? undefined : datalistId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className={cn(className, readOnly ? "bg-slate-50" : undefined)}
      />
      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
      {!readOnly ? (
        <datalist id={datalistId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </div>
  );
}
