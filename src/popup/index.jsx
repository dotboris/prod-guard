import './index.scss'
import React from 'react'
import { render } from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './app'

main()

async function main () {
  const root = document.createElement('div')
  root.className = 'app-root'
  document.body.append(root)

  const queryClient = new QueryClient()

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
    root
  )
}
