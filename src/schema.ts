import { z } from 'zod'

/**
 * Current data version. The state is versioned using a number. The first
 * version is `0` and gets incremented with every upgrade.
 */
export const CURRENT_DATA_VERSION = 4

/**
 * Pseudo enum that represents that represents the various warning styles. This
 * is means to avoid having to write strings all over the code.
 */
export const WarningStyle = {
  Border: 'border',
  TopBanner: 'topBanner',
  BottomBanner: 'bottomBanner',
} as const

export const topBannerWarningSchema = z.object({
  enabled: z.boolean(),
  warningStyle: z.literal(WarningStyle.TopBanner),
  pattern: z.string(),
  text: z.string(),
  textColor: z.string(),
  backgroundColor: z.string(),
})
export type TopBannerWarning = z.infer<typeof topBannerWarningSchema>

export const BottomBannerWarningSchema = z.object({
  enabled: z.boolean(),
  warningStyle: z.literal(WarningStyle.BottomBanner),
  pattern: z.string(),
  text: z.string(),
  textColor: z.string(),
  backgroundColor: z.string(),
})
export type BottomBannerWarning = z.infer<typeof BottomBannerWarningSchema>

export type BannerWarning = TopBannerWarning | BottomBannerWarning

export const borderWarningSchema = z.object({
  enabled: z.boolean(),
  warningStyle: z.literal(WarningStyle.Border),
  pattern: z.string(),
  borderColor: z.string(),
})
export type BorderWarning = z.infer<typeof borderWarningSchema>

export const warningSchema = z.discriminatedUnion('warningStyle', [
  topBannerWarningSchema,
  BottomBannerWarningSchema,
  borderWarningSchema,
])
export type Warning = z.infer<typeof warningSchema>

const warningWithIdSchema = warningSchema.and(z.object({ id: z.string() }))
export type WarningWithId = z.infer<typeof warningWithIdSchema>

export const allDataSchema = z.object({
  dataVersion: z.literal(CURRENT_DATA_VERSION),
  warnings: z.array(warningWithIdSchema),
})
export type AllData = z.infer<typeof allDataSchema>
