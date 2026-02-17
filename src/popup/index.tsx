import "./styles.css";
import browser from "webextension-polyfill";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { HashRouter } from "react-router";
import { useState } from "react";
import { trpc } from "./trpc";
import { chromeLink } from "trpc-chrome/link";

const port = browser.runtime.connect();

main();

function Root() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [chromeLink({ port })],
    }),
  );

  return (
    <>
      <HashRouter>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </trpc.Provider>
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
