import './index.scss'
import React from 'react'
import { render } from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './app'
import { LocationProvider } from '@reach/router'

main()

async function main () {
  const root = document.createElement('div')
  root.className = 'app-root'
  document.body.append(root)

  const queryClient = new QueryClient()

  render(
    <LocationProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </LocationProvider>,
    root
  )
}
