import { useState, useMemo, useCallback } from 'react'
import type { FireInputs, FireResults } from '../types'
import { calculateFire } from '../utils/fireCalc'

const defaultInputs: FireInputs = {
  currentAge: 30,
  retirementAge: 45,
  lifeExpectancy: 85,
  monthlyIncome: 150000,
  monthlyExpenses: 60000,
  monthlySavings: 90000,
  yearlySavingsIncrement: 5,
  currentSavings: 1000000,
  preRetirementReturn: 12,
  postRetirementReturn: 8,
  inflationRate: 6,
  safeWithdrawalRate: 3.5,
}

export function useFireCalculator() {
  const [inputs, setInputs] = useState<FireInputs>(defaultInputs)
  const [savingsManuallySet, setSavingsManuallySet] = useState(false)

  const updateField = useCallback(
    (field: keyof FireInputs, value: number) => {
      setInputs((prev) => {
        const next = { ...prev, [field]: value }

        if (field === 'monthlySavings') {
          setSavingsManuallySet(true)
        }

        // Auto-derive savings unless manually set
        if (
          !savingsManuallySet &&
          (field === 'monthlyIncome' || field === 'monthlyExpenses')
        ) {
          next.monthlySavings = Math.max(
            0,
            next.monthlyIncome - next.monthlyExpenses
          )
        }

        if (field === 'monthlySavings') {
          next.monthlySavings = value
        }

        return next
      })
    },
    [savingsManuallySet]
  )

  const results: FireResults = useMemo(() => calculateFire(inputs), [inputs])

  return { inputs, updateField, results }
}
