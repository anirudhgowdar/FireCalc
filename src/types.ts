export interface FireInputs {
  currentAge: number
  retirementAge: number
  lifeExpectancy: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  yearlySavingsIncrement: number
  currentSavings: number
  preRetirementReturn: number
  postRetirementReturn: number
  inflationRate: number
  safeWithdrawalRate: number
}

export interface YearProjection {
  age: number
  year: number
  phase: 'accumulation' | 'retirement'
  savings: number
  growth: number
  expenses: number
  endingCorpus: number
}

export interface FireResults {
  fireNumber: number
  yearsToFire: number
  projectedCorpus: number
  surplusOrDeficit: number
  corpusLastsUntilAge: number
  monthlyExpensesAtRetirement: number
  projections: YearProjection[]
}
