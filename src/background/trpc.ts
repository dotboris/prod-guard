import { initTRPC } from '@trpc/server'
import { type State } from './state'
import { ZodError } from 'zod'

interface Context {
  state: State
}

const t = initTRPC.context<Context>().create({
  isServer: false,
  allowOutsideOfServer: true,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodIssues:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.issues
            : undefined,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure
