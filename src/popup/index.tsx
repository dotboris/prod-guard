import './index.scss'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './app'
import { BrowserRouter } from 'react-router-dom'

main().catch((err) => {
  console.error('Failed to initialize popup', err)
})

async function main(): Promise<void> {
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
    </BrowserRouter>,
  )
}
