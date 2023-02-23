import { render } from "react-dom";
import { MetamaskStateProvider } from "use-metamask";
import { ErrorBoundary } from "react-error-boundary";

import App from "./App";
import { ErrorFallback } from "./ErrorFallback";

const rootElement = document.getElementById("root");

render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <MetamaskStateProvider>
      <App />
    </MetamaskStateProvider>
  </ErrorBoundary>,
  rootElement
);
