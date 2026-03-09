import type { FireInputs } from '../types'
import { InputField } from './InputField'

interface InputSectionProps {
  inputs: FireInputs
  updateField: (field: keyof FireInputs, value: number) => void
}

function GroupCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl p-5 sm:p-6 space-y-4"
      style={{
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-widest pb-2"
        style={{
          color: 'var(--color-accent)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

export function InputSection({ inputs, updateField }: InputSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <GroupCard title="Personal">
        <InputField
          label="Current age"
          value={inputs.currentAge}
          onChange={(v) => updateField('currentAge', v)}
          suffix="yrs"
          min={18}
          max={100}
        />
        <InputField
          label="Retirement age"
          value={inputs.retirementAge}
          onChange={(v) => updateField('retirementAge', v)}
          suffix="yrs"
          min={18}
          max={100}
        />
        <InputField
          label="Life expectancy"
          value={inputs.lifeExpectancy}
          onChange={(v) => updateField('lifeExpectancy', v)}
          suffix="yrs"
          min={40}
          max={120}
        />
      </GroupCard>

      <GroupCard title="Income & Savings">
        <InputField
          label="Monthly income"
          value={inputs.monthlyIncome}
          onChange={(v) => updateField('monthlyIncome', v)}
          prefix="₹"
          step={1000}
          min={0}
        />
        <InputField
          label="Monthly expenses"
          value={inputs.monthlyExpenses}
          onChange={(v) => updateField('monthlyExpenses', v)}
          prefix="₹"
          step={1000}
          min={0}
        />
        <InputField
          label="Monthly savings"
          value={inputs.monthlySavings}
          onChange={(v) => updateField('monthlySavings', v)}
          prefix="₹"
          step={1000}
          min={0}
        />
        <InputField
          label="Yearly savings increment"
          value={inputs.yearlySavingsIncrement}
          onChange={(v) => updateField('yearlySavingsIncrement', v)}
          suffix="%"
          step={0.5}
          min={0}
          max={50}
        />
      </GroupCard>

      <GroupCard title="Existing Wealth">
        <InputField
          label="Current savings / investments"
          value={inputs.currentSavings}
          onChange={(v) => updateField('currentSavings', v)}
          prefix="₹"
          step={10000}
          min={0}
        />
      </GroupCard>

      <GroupCard title="Return Assumptions">
        <InputField
          label="Pre-retirement return"
          value={inputs.preRetirementReturn}
          onChange={(v) => updateField('preRetirementReturn', v)}
          suffix="%"
          step={0.5}
          min={0}
          max={30}
        />
        <InputField
          label="Post-retirement return"
          value={inputs.postRetirementReturn}
          onChange={(v) => updateField('postRetirementReturn', v)}
          suffix="%"
          step={0.5}
          min={0}
          max={30}
        />
        <InputField
          label="Inflation rate"
          value={inputs.inflationRate}
          onChange={(v) => updateField('inflationRate', v)}
          suffix="%"
          step={0.5}
          min={0}
          max={20}
        />
        <InputField
          label="Safe withdrawal rate"
          value={inputs.safeWithdrawalRate}
          onChange={(v) => updateField('safeWithdrawalRate', v)}
          suffix="%"
          step={0.1}
          min={0.5}
          max={10}
        />
      </GroupCard>
    </div>
  )
}
