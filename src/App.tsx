import { useDarkMode } from './hooks/useDarkMode'
import { useFireCalculator } from './hooks/useFireCalculator'
import { Layout } from './components/Layout'
import { InputSection } from './components/InputSection'
import { ResultsSection } from './components/ResultsSection'

export default function App() {
  const { isDark, toggle } = useDarkMode()
  const { inputs, updateField, results } = useFireCalculator()

  return (
    <Layout isDark={isDark} toggleDark={toggle}>
      <div className="space-y-8">
        <InputSection inputs={inputs} updateField={updateField} />
        <ResultsSection results={results} />
      </div>
    </Layout>
  )
}
