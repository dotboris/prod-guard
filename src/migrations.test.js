import { migrations, migrateStorageData } from './migrations'
import { v4 as uuidV4 } from 'uuid'

jest.mock('uuid', () => {
  const { v4: realUuidV4 } = jest.requireActual('uuid')
  return {
    v4: jest.fn(() => realUuidV4())
  }
})

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
    // Only checking length here because further migrations mess with all the
    // other fields
    expect(res.warnings).toHaveLength(3)
  })

  it('should set default fields values for warnings', async () => {
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

    for (const warning of res.warnings) {
      // Warning id gets changed in a later migration, we don't test it here.
      delete warning.id
    }

    expect(res.warnings).toEqual([
      {
        pattern: 'test1',
        warningStyle: 'border',
        borderColor: 'FF0000'
      },
      {
        pattern: 'test2',
        warningStyle: 'bottomBanner',
        text: 'Warning! This is Production!',
        backgroundColor: 'FF0000',
        textColor: 'FFFFFF'
      },
      {
        pattern: 'test3',
        warningStyle: 'topBanner',
        text: 'Warning! This is Production!',
        backgroundColor: 'FF0000',
        textColor: 'FFFFFF'
      }
    ])
  })

  it('should convert numeric ids to unique ids', async () => {
    uuidV4.mockImplementationOnce(() => 'uuid-1')
    uuidV4.mockImplementationOnce(() => 'uuid-2')
    // Duplicate on purpose, generation should be resilient to that
    uuidV4.mockImplementationOnce(() => 'uuid-2')
    uuidV4.mockImplementationOnce(() => 'uuid-3')

    const warnings = [
      { id: 0 },
      { id: 1 },
      { id: 2 }
    ]

    const [hasMigrated, res] = await migrateStorageData(migrations, {
      dataVersion: 2,
      warnings
    })

    expect(hasMigrated).toBe(true)

    const warningIds = res.warnings.map(warning => warning.id)
    expect(warningIds).toEqual(['uuid-1', 'uuid-2', 'uuid-3'])
  })
})
