interface InputFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  step?: number
  min?: number
  max?: number
}

export function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min,
  max,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-xs font-medium uppercase tracking-wide"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </label>
      <div
        className="flex items-center rounded-lg overflow-hidden transition-colors focus-within:ring-2"
        style={{
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-input)',
          '--tw-ring-color': 'var(--color-border-focus)',
        } as React.CSSProperties}
      >
        {prefix && (
          <span
            className="pl-3 text-sm select-none shrink-0"
            style={{ color: 'var(--color-text-faint)' }}
          >
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          min={min}
          max={max}
          className="w-full px-3 py-2.5 text-right text-sm bg-transparent outline-none"
          style={{ color: 'var(--color-text)' }}
        />
        {suffix && (
          <span
            className="pr-3 text-sm select-none shrink-0"
            style={{ color: 'var(--color-text-faint)' }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
