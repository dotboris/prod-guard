import { describe, it, expect } from 'vitest'
import { applyMigrations } from './apply-migrations'

describe('applyMigrations()', () => {
  it('should return input data with no migrations', async () => {
    const storageData = {
      test: 1,
      foo: 'bar',
    }

    const [hasMigrated, res] = await applyMigrations([], storageData)

    expect(hasMigrated).toBe(false)
    expect(res).toEqual({
      dataVersion: 0,
      test: 1,
      foo: 'bar',
    })
  })

  it('should apply all migrations when starting from scratch', async () => {
    const storageData = {}
    const migrations = [
      async () => ({ list: [] }),
      async (data: any) => ({ ...data, thing: true }),
      async (data: { list: any }) => ({ ...data, list: [...data.list, 42] }),
      async (data: { list: any }) => ({ ...data, list: [...data.list, 43] }),
    ]

    const [hasMigrated, res] = await applyMigrations(migrations, storageData)

    expect(hasMigrated).toBe(true)
    expect(res).toEqual({
      dataVersion: 4,
      list: [42, 43],
      thing: true,
    })
  })

  it('should apply only new migrations when starting in the middle', async () => {
    const storageData = { dataVersion: 3 }
    const migrations = [
      async () => ({ zero: true }),
      async (data: any) => ({ ...data, one: true }),
      async (data: any) => ({ ...data, two: true }),
      async (data: any) => ({ ...data, three: true }),
      async (data: any) => ({ ...data, four: true }),
      async (data: any) => ({ ...data, five: true }),
    ]

    const [hasMigrated, res] = await applyMigrations(migrations, storageData)

    expect(hasMigrated).toBe(true)
    expect(res).toEqual({
      dataVersion: 6,
      three: true,
      four: true,
      five: true,
    })
  })

  it('should crash when dataVersion is garbage', async () => {
    await expect(
      async () => await applyMigrations([], { dataVersion: 'garbage' }),
    ).rejects.toThrow(TypeError)
  })
})
