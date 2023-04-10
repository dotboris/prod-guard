import { setupService } from './service'

setupService().catch((error) => {
  console.error('ProdGuard background script has failed to setup', error)
})
