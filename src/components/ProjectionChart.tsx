import { useMemo, useState, useRef, useEffect } from 'react'
import type { YearProjection } from '../types'
import { formatINRCompact } from '../utils/format'

interface ProjectionChartProps {
  projections: YearProjection[]
}

// Chart layout constants
const PADDING = { top: 24, right: 16, bottom: 44, left: 12 }

export function ProjectionChart({ projections }: ProjectionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [chartWidth, setChartWidth] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartWidth(entry.contentRect.width)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const HEIGHT = 320
  const plotW = chartWidth - PADDING.left - PADDING.right
  const plotH = HEIGHT - PADDING.top - PADDING.bottom

  const { maxCorpus, retirementIndex, depletionIndex } = useMemo(() => {
    let max = 0
    let retIdx = -1
    let depIdx = -1
    for (let i = 0; i < projections.length; i++) {
      if (projections[i].endingCorpus > max) max = projections[i].endingCorpus
      if (retIdx === -1 && projections[i].phase === 'retirement') retIdx = i
      if (depIdx === -1 && projections[i].endingCorpus <= 0) depIdx = i
    }
    return { maxCorpus: max || 1, retirementIndex: retIdx, depletionIndex: depIdx }
  }, [projections])

  if (projections.length === 0) return null

  const n = projections.length
  const xStep = plotW / Math.max(n - 1, 1)

  function x(i: number) {
    return PADDING.left + i * xStep
  }
  function y(val: number) {
    return PADDING.top + plotH - (val / maxCorpus) * plotH
  }

  // Build area path
  const linePoints = projections.map((p, i) => `${x(i)},${y(p.endingCorpus)}`)
  const linePath = `M${linePoints.join(' L')}`
  const areaPath = `${linePath} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`

  // Y-axis grid lines (5 steps)
  const gridLines = Array.from({ length: 6 }, (_, i) => {
    const val = (maxCorpus / 5) * i
    return { val, yPos: y(val) }
  })

  // X-axis labels — show ~6–8 labels spread evenly
  const labelInterval = Math.max(1, Math.ceil(n / 8))
  const xLabels = projections
    .map((p, i) => ({ age: p.age, i }))
    .filter((_, i) => i === 0 || i === n - 1 || i % labelInterval === 0)

  // Retirement divider line
  const retX = retirementIndex >= 0 ? x(retirementIndex) : null

  // Tooltip data
  const hovered = hoveredIndex !== null ? projections[hoveredIndex] : null

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="w-full" ref={containerRef}>
        <svg
          width={chartWidth}
          height={HEIGHT}
          viewBox={`0 0 ${chartWidth} ${HEIGHT}`}
          className="block"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid lines */}
          {gridLines.map(({ val, yPos }) => (
            <g key={val}>
              <line
                x1={PADDING.left}
                y1={yPos}
                x2={PADDING.left + plotW}
                y2={yPos}
                stroke="var(--color-border)"
                strokeWidth="1"
                strokeDasharray={val === 0 ? undefined : '4,4'}
              />
              {val > 0 && (
                <text
                  x={PADDING.left + 4}
                  y={yPos - 4}
                  fontSize="10"
                  fill="var(--color-text-faint)"
                  fontFamily="ui-monospace, monospace"
                >
                  {formatINRCompact(val)}
                </text>
              )}
            </g>
          ))}

          {/* Retirement divider */}
          {retX !== null && (
            <>
              <line
                x1={retX}
                y1={PADDING.top}
                x2={retX}
                y2={PADDING.top + plotH}
                stroke="var(--color-warn)"
                strokeWidth="1"
                strokeDasharray="6,4"
              />
              <text
                x={retX + 4}
                y={PADDING.top + 12}
                fontSize="10"
                fontWeight="600"
                fill="var(--color-warn)"
              >
                Retirement
              </text>
            </>
          )}

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-bar-accum)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-bar-accum)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#corpusGrad)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-bar-accum)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Depletion marker */}
          {depletionIndex >= 0 && (
            <circle
              cx={x(depletionIndex)}
              cy={y(0)}
              r="5"
              fill="var(--color-bar-depleted)"
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
          )}

          {/* X-axis labels */}
          {xLabels.map(({ age, i }) => (
            <text
              key={i}
              x={x(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-text-faint)"
              fontFamily="ui-monospace, monospace"
            >
              {age}
            </text>
          ))}

          {/* X axis label */}
          <text
            x={PADDING.left + plotW / 2}
            y={HEIGHT - 0}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-muted)"
          >
            Age
          </text>

          {/* Hover hit areas */}
          {projections.map((_, i) => (
            <rect
              key={i}
              x={x(i) - xStep / 2}
              y={PADDING.top}
              width={xStep}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onTouchStart={() => setHoveredIndex(i)}
            />
          ))}

          {/* Hover indicator */}
          {hoveredIndex !== null && hovered && (
            <>
              <line
                x1={x(hoveredIndex)}
                y1={PADDING.top}
                x2={x(hoveredIndex)}
                y2={PADDING.top + plotH}
                stroke="var(--color-text-muted)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <circle
                cx={x(hoveredIndex)}
                cy={y(hovered.endingCorpus)}
                r="4"
                fill="var(--color-bar-accum)"
                stroke="var(--color-surface)"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>

      {/* Tooltip bar below chart */}
      <div
        className="px-4 py-3 flex flex-wrap gap-x-5 gap-y-1 text-xs tabular-nums font-mono min-h-[40px] items-center"
        style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}
      >
        {hovered ? (
          <>
            <span style={{ color: 'var(--color-text)' }}>
              <b>Age {hovered.age}</b>{' '}
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase"
                style={{
                  backgroundColor: hovered.phase === 'retirement'
                    ? 'var(--color-badge-retire-bg)'
                    : 'var(--color-badge-accum-bg)',
                  color: hovered.phase === 'retirement'
                    ? 'var(--color-badge-retire-text)'
                    : 'var(--color-badge-accum-text)',
                }}
              >
                {hovered.phase === 'retirement' ? 'Retire' : 'Accum'}
              </span>
            </span>
            <span style={{ color: 'var(--color-accent)' }}>
              Corpus: {formatINRCompact(hovered.endingCorpus)}
            </span>
            {hovered.savings > 0 && (
              <span style={{ color: 'var(--color-text-muted)' }}>
                Saved: {formatINRCompact(hovered.savings)}
              </span>
            )}
            {hovered.growth > 0 && (
              <span style={{ color: 'var(--color-success)' }}>
                Growth: {formatINRCompact(hovered.growth)}
              </span>
            )}
            {hovered.expenses > 0 && (
              <span style={{ color: 'var(--color-danger)' }}>
                Expenses: {formatINRCompact(hovered.expenses)}
              </span>
            )}
          </>
        ) : (
          <span style={{ color: 'var(--color-text-faint)' }}>
            Hover over the chart to see details for each year
          </span>
        )}
      </div>
    </div>
  )
}
