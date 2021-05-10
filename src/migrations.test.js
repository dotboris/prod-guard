import { migrations, migrateStorageData } from './migrations'

describe('migrateStorageData()', () => {
  it('should return input data with no migrations', async () => {
    const storageData = {
      test: 1,
      foo: 'bar'
    }

    const [hasMigrated, res] = await migrateStorageData([], storageData)

    expect(hasMigrated).toBe(false)
    expect(res).toEqual({
      dataVersion: 0,
      test: 1,
      foo: 'bar'
    })
  })

  it('should apply all migrations when starting from scratch', async () => {
    const storageData = {}
    const migrations = [
      async () => ({ list: [] }),
      async data => ({ ...data, thing: true }),
      async data => ({ ...data, list: [...data.list, 42] }),
      async data => ({ ...data, list: [...data.list, 43] })
    ]

    const [hasMigrated, res] = await migrateStorageData(migrations, storageData)

    expect(hasMigrated).toBe(true)
    expect(res).toEqual({
      dataVersion: 4,
      list: [42, 43],
      thing: true
    })
  })

  it('should apply only new migrations when starting in the middle', async () => {
    const storageData = { dataVersion: 3 }
    const migrations = [
      async () => ({ zero: true }),
      async data => ({ ...data, one: true }),
      async data => ({ ...data, two: true }),
      async data => ({ ...data, three: true }),
      async data => ({ ...data, four: true }),
      async data => ({ ...data, five: true })
    ]

    const [hasMigrated, res] = await migrateStorageData(migrations, storageData)

    expect(hasMigrated).toBe(true)
    expect(res).toEqual({
      dataVersion: 6,
      three: true,
      four: true,
      five: true
    })
  })
})

describe('data migrations', () => {
  it('should start us off with empty warnings on fresh dataset', async () => {
    const [hasMigrated, res] = await migrateStorageData(migrations, {})

    expect(hasMigrated).toBe(true)
    expect(res.warnings).toEqual([])
  })

  it('should convert sites to warnings when set', async () => {
    const sites = [
      { id: 0, pattern: 'test1', warningStyle: 'border' },
      { id: 1, pattern: 'test2', warningStyle: 'bottomBanner' },
      { id: 2, pattern: 'test3', warningStyle: 'topBanner' }
    ]
    const [hasMigrated, res] = await migrateStorageData(migrations, { sites })

    expect(hasMigrated).toBe(true)
    const warningIds = res.warnings.map(warning => warning.id)
    expect(warningIds).toEqual([0, 1, 2])
  })

  it('should set default text for banners type warnings', async () => {
    const warnings = [
      { id: 0, pattern: 'test1', warningStyle: 'border' },
      { id: 1, pattern: 'test2', warningStyle: 'bottomBanner' },
      { id: 2, pattern: 'test3', warningStyle: 'topBanner' }
    ]
    const [hasMigrated, res] = await migrateStorageData(migrations, {
      dataVersion: 1,
      warnings
    })

    expect(hasMigrated).toBe(true)
    expect(res.warnings).toEqual([
      { id: 0, pattern: 'test1', warningStyle: 'border' },
      {
        id: 1,
        pattern: 'test2',
        warningStyle: 'bottomBanner',
        text: 'Warning! This is Production!'
      },
      {
        id: 2,
        pattern: 'test3',
        warningStyle: 'topBanner',
        text: 'Warning! This is Production!'
      }
    ])
  })
})
