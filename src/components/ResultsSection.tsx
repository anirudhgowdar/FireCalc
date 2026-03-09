import type { FireResults } from '../types'
import { formatINRCompact } from '../utils/format'
import { SummaryCard } from './SummaryCard'
import { ProjectionChart } from './ProjectionChart'

interface ResultsSectionProps {
  results: FireResults
}

export function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div
        className="pt-6 sm:pt-8"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <h2
          className="text-base sm:text-lg font-bold mb-4 sm:mb-5"
          style={{ color: 'var(--color-text)' }}
        >
          Results
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <SummaryCard
            label="FIRE Number"
            value={formatINRCompact(results.fireNumber)}
          />
          <SummaryCard
            label="Years to FIRE"
            value={`${results.yearsToFire} yrs`}
          />
          <SummaryCard
            label="Projected Corpus"
            value={formatINRCompact(results.projectedCorpus)}
          />
          <SummaryCard
            label="Surplus / Deficit"
            value={formatINRCompact(results.surplusOrDeficit)}
            variant={results.surplusOrDeficit >= 0 ? 'success' : 'danger'}
          />
          <SummaryCard
            label="Corpus Lasts Until"
            value={`Age ${results.corpusLastsUntilAge}`}
            variant={
              results.corpusLastsUntilAge >= 85 ? 'success' : 'danger'
            }
          />
          <SummaryCard
            label="Expenses at Retirement"
            value={formatINRCompact(results.monthlyExpensesAtRetirement) + '/mo'}
          />
        </div>
      </div>

      <div>
        <h3
          className="text-sm sm:text-base font-semibold mb-3 sm:mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Year-by-Year Projection
        </h3>
        <ProjectionChart projections={results.projections} />
      </div>
    </div>
  )
}
