import { ApiPlayground } from './components/ApiPlayground';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext'
import Layout from '@/components/Layout'
import StartPage from '@/components/StartPage'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

const AppInner = () => {
  const { theme } = useThemeContext()

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <StartPage theme={theme} />
      {/* <ApiPlayground specUrl="https://petstore.swagger.io/v2/swagger.json" theme={theme} /> */}
    </>
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App;