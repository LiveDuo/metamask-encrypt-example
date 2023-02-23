
import { createRoot } from 'react-dom/client'
import { MetamaskStateProvider } from 'use-metamask'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import App from './App'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const Index = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <MetamaskStateProvider>
      <App />
    </MetamaskStateProvider>
  </ErrorBoundary>
)

const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)
root.render(<Index/>)
