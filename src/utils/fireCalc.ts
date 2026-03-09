import type { FireInputs, FireResults, YearProjection } from '../types'

export function calculateFire(inputs: FireInputs): FireResults {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    monthlyExpenses,
    monthlySavings,
    yearlySavingsIncrement,
    currentSavings,
    preRetirementReturn,
    postRetirementReturn,
    inflationRate,
    safeWithdrawalRate,
  } = inputs

  const yearsToRetirement = Math.max(0, retirementAge - currentAge)
  const annualExpensesAtRetirement =
    monthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const fireNumber =
    safeWithdrawalRate > 0
      ? annualExpensesAtRetirement / (safeWithdrawalRate / 100)
      : 0

  const projections: YearProjection[] = []

  // Accumulation phase
  let corpus = currentSavings
  let annualSavings = monthlySavings * 12
  const monthlyRate = preRetirementReturn / 100 / 12

  for (let y = 1; y <= yearsToRetirement; y++) {
    if (y > 1) {
      annualSavings *= 1 + yearlySavingsIncrement / 100
    }

    const startCorpus = corpus
    const growth = startCorpus * (preRetirementReturn / 100)

    // Future value of annuity for monthly savings compounded monthly
    let savingsGrowth: number
    if (monthlyRate > 0) {
      const monthlySav = annualSavings / 12
      savingsGrowth =
        monthlySav * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate)
    } else {
      savingsGrowth = annualSavings
    }

    corpus = startCorpus * (1 + preRetirementReturn / 100) + savingsGrowth

    projections.push({
      age: currentAge + y,
      year: y,
      phase: 'accumulation',
      savings: annualSavings,
      growth,
      expenses: 0,
      endingCorpus: corpus,
    })
  }

  const projectedCorpus = corpus
  const surplusOrDeficit = projectedCorpus - fireNumber

  // Decumulation phase
  let annualExpenses = annualExpensesAtRetirement
  let corpusLastsUntilAge = lifeExpectancy

  const retirementYears = lifeExpectancy - retirementAge

  for (let y = 1; y <= retirementYears; y++) {
    const startCorpus = corpus
    const withdrawal = annualExpenses
    const growth = Math.max(0, startCorpus - withdrawal) * (postRetirementReturn / 100)
    corpus = (startCorpus - withdrawal) * (1 + postRetirementReturn / 100)

    if (corpus <= 0) {
      corpus = 0
      corpusLastsUntilAge = retirementAge + y
      projections.push({
        age: retirementAge + y,
        year: yearsToRetirement + y,
        phase: 'retirement',
        savings: 0,
        growth,
        expenses: withdrawal,
        endingCorpus: 0,
      })
      break
    }

    projections.push({
      age: retirementAge + y,
      year: yearsToRetirement + y,
      phase: 'retirement',
      savings: 0,
      growth,
      expenses: withdrawal,
      endingCorpus: corpus,
    })

    annualExpenses *= 1 + inflationRate / 100
  }

  return {
    fireNumber,
    yearsToFire: yearsToRetirement,
    projectedCorpus,
    surplusOrDeficit,
    corpusLastsUntilAge,
    monthlyExpensesAtRetirement: annualExpensesAtRetirement / 12,
    projections,
  }
}
