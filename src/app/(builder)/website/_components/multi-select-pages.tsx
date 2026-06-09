"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectPagesProps {
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  allowCustomValues?: boolean;
  customPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  tagClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function MultiSelectPages({
  value,
  options,
  onChange,
  label,
  description,
  placeholder = "Add item",
  allowCustomValues = false,
  customPlaceholder = "Enter keyword",
  disabled = false,
  className,
  tagClassName,
}: MultiSelectPagesProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOptions = value.map((val) => {
    return options.find((opt) => opt.value === val) ?? { label: val, value: val };
  });

  const availableOptions = options.filter((opt) => !value.includes(opt.value));
  
  const filteredOptions = availableOptions.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addValue = (nextValue: string) => {
    const normalized = nextValue.trim();
    if (!normalized || value.includes(normalized)) return;
    onChange([...value, normalized]);
  };

  const removeValue = (nextValue: string) => {
    onChange(value.filter((item) => item !== nextValue));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (allowCustomValues && inputValue.trim()) {
        addValue(inputValue.trim());
        setInputValue("");
        setIsOpen(false);
      }
    } else if (event.key === "Backspace" && !inputValue && value.length > 0) {
      removeValue(value[value.length - 1]);
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsOpen(true);
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label className="text-[10px] font-semibold text-slate-600">{label}</label>
      ) : null}
      
      <div className="relative" ref={containerRef}>
        <div
          onClick={handleContainerClick}
          className={cn(
            "flex min-h-[2.25rem] w-full flex-wrap items-center gap-1.5 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-2.5 py-1.5 pr-8 transition",
            "focus-within:border-[var(--vendor-primary-btn)] focus-within:ring-1 focus-within:ring-[var(--vendor-primary-btn)]/30 cursor-text",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded bg-[var(--vendor-primary-btn)]/10 px-2 text-[10px] font-semibold text-[var(--vendor-primary-btn)]",
                tagClassName
              )}
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeValue(option.value);
                }}
                disabled={disabled}
                className="rounded p-0.5 text-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/20 disabled:cursor-not-allowed"
                aria-label={`Remove ${option.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ""}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-grow min-w-[80px] bg-transparent border-0 p-0 text-[10px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown className="h-3.5 w-3.5" />
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-40 overflow-y-auto rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white py-1 shadow-md">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addValue(option.value);
                  setInputValue("");
                  setIsOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-[10px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {description ? (
        <p className="text-[9px] font-medium leading-4 text-[var(--vendor-text-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
