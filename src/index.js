
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { MetamaskStateProvider } from 'use-metamask'
import { ErrorBoundary } from 'react-error-boundary'

import App from './App'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const Index = () => (
  <ChakraProvider>
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <MetamaskStateProvider>
      <App />
    </MetamaskStateProvider>
  </ErrorBoundary>
  </ChakraProvider>
)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Index/>)
