import "@fontsource/roboto";
import "@fontsource-variable/roboto-mono";
import "./styles.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { HashRouter } from "react-router";
import { useState } from "react";

main();

function Root() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <HashRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </HashRouter>
    </>
  );
}

function main() {
  const rootElement = document.createElement("div");
  rootElement.className = "app-root";
  document.body.append(rootElement);
  const root = createRoot(rootElement);
  root.render(<Root />);
}
