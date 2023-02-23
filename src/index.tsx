
import { render } from 'react-dom'
// import { ChakraProvider } from '@chakra-ui/react'
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

const rootElement = document.getElementById('root')

render(
  // <ChakraProvider>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <MetamaskStateProvider>
        <App />
      </MetamaskStateProvider>
    </ErrorBoundary>,
  // </ChakraProvider>
  rootElement
)
