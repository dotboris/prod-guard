import browser from 'webextension-polyfill'
import './index.scss'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './app'
import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import { trpc } from './trpc'
import { chromeLink } from 'trpc-chrome/link'

const port = browser.runtime.connect()

main().catch((err) => {
  console.error('Failed to initialize popup', err)
})

function Root(): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [chromeLink({ port })],
    }),
  )

  return (
    <BrowserRouter>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </trpc.Provider>
    </BrowserRouter>
  )
}

async function main(): Promise<void> {
  const rootElement = document.createElement('div')
  rootElement.className = 'app-root'
  document.body.append(rootElement)
  const root = createRoot(rootElement)
  root.render(<Root />)
}
