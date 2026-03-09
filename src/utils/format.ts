const inrFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

export function formatINR(value: number): string {
  return '₹' + inrFormatter.format(Math.round(value))
}

export function formatINRCompact(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (abs >= 1_00_00_000) {
    const cr = abs / 1_00_00_000
    return sign + '₹' + cr.toFixed(cr >= 100 ? 0 : cr >= 10 ? 1 : 2) + ' Cr'
  }
  if (abs >= 1_00_000) {
    const l = abs / 1_00_000
    return sign + '₹' + l.toFixed(l >= 100 ? 0 : l >= 10 ? 1 : 2) + ' L'
  }
  if (abs >= 1_000) {
    return sign + '₹' + (abs / 1_000).toFixed(1) + 'K'
  }
  return sign + '₹' + Math.round(abs).toString()
}

export function parseINR(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, '')
  const num = Number(cleaned)
  return isNaN(num) ? 0 : num
}
