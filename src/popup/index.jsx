import './index.scss'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './app'
import { BrowserRouter } from 'react-router-dom'

main()

async function main() {
  const rootElement = document.createElement('div')
  rootElement.className = 'app-root'
  document.body.append(rootElement)

  const queryClient = new QueryClient()

  const root = createRoot(rootElement)
  root.render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
