import { z } from 'zod'
import { publicProcedure, router } from './trpc'
import { allDataSchema, warningSchema } from '../schema'
import { saveAllData } from './storage'

export const appRouter = router({
  warnings: router({
    list: publicProcedure.query(({ ctx }) => ctx.state.getAllWarnings()),
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ ctx, input }) => ctx.state.getWarning(input.id)),
    add: publicProcedure
      .input(
        z.object({
          warning: warningSchema,
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const res = ctx.state.addWarning(input.warning)
        await saveAllData(ctx.state)
        return res
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          warning: warningSchema,
        }),
      )
      .mutation(async ({ ctx, input }) => {
        ctx.state.updateWarning(input.id, input.warning)
        await saveAllData(ctx.state)
      }),
    remove: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const res = ctx.state.removeWarning(input.id)
        await saveAllData(ctx.state)
        return res
      }),
    toggleEnabled: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        ctx.state.toggleWarningEnabled(input.id)
        await saveAllData(ctx.state)
      }),
  }),
  exportAllData: publicProcedure.query(({ ctx }) => ctx.state.exportAllData()),
  importAllData: publicProcedure
    .input(z.object({ allData: allDataSchema }))
    .mutation(async ({ ctx, input }) => {
      ctx.state.importAllData(input.allData)
      await saveAllData(ctx.state)
    }),
})
