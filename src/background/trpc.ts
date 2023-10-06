import { initTRPC } from '@trpc/server'
import { type State } from './state'

interface Context {
  state: State
}

const t = initTRPC.context<Context>().create({
  isServer: false,
  allowOutsideOfServer: true,
})
export const router = t.router
export const publicProcedure = t.procedure
