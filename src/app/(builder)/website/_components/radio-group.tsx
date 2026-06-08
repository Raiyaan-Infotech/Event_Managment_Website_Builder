"use client";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  className,
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-3"
          onClick={() => onChange(opt.value)}
        >
          <span
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
              value === opt.value
                ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]"
                : "border-slate-300 bg-white"
            }`}
          >
            {value === opt.value && (
              <span className="h-[7px] w-[7px] rounded-full bg-white" />
            )}
          </span>
          <span
            className={`text-[13px] font-semibold transition-colors ${
              value === opt.value
                ? "text-slate-900"
                : "text-slate-600"
            }`}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}
