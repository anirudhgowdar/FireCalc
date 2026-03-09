interface SummaryCardProps {
  label: string
  value: string
  variant?: 'default' | 'success' | 'danger'
}

export function SummaryCard({
  label,
  value,
  variant = 'default',
}: SummaryCardProps) {
  const colorMap = {
    default: {
      bg: 'var(--color-accent-light)',
      text: 'var(--color-accent)',
      border: 'var(--color-accent)',
    },
    success: {
      bg: 'var(--color-success-light)',
      text: 'var(--color-success)',
      border: 'var(--color-success)',
    },
    danger: {
      bg: 'var(--color-danger-light)',
      text: 'var(--color-danger)',
      border: 'var(--color-danger)',
    },
  }

  const colors = colorMap[variant]

  return (
    <div
      className="rounded-xl p-4 sm:p-5"
      style={{
        backgroundColor: colors.bg,
        borderLeft: `3px solid ${colors.border}`,
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wide mb-2"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>
      <p
        className="text-lg sm:text-xl font-bold tabular-nums"
        style={{ color: colors.text }}
      >
        {value}
      </p>
    </div>
  )
}
