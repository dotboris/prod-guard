import { migrations, migrateStorageData } from './migrations'
import { v4 as uuidV4 } from 'uuid'
import { range } from 'lodash'

const _uuid = jest.requireActual('uuid')

jest.mock('uuid', () => ({ v4: jest.fn() }))

function resetUuidV4() {
  uuidV4.mockReset()
  uuidV4.mockImplementation(() => _uuid.v4())
}

describe('migrateStorageData()', () => {
  it('should return input data with no migrations', async () => {
    const storageData = {
      test: 1,
      foo: 'bar',
    }

    const [hasMigrated, res] = await migrateStorageData([], storageData)

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
      async (data) => ({ ...data, thing: true }),
      async (data) => ({ ...data, list: [...data.list, 42] }),
      async (data) => ({ ...data, list: [...data.list, 43] }),
    ]

    const [hasMigrated, res] = await migrateStorageData(migrations, storageData)

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
      async (data) => ({ ...data, one: true }),
      async (data) => ({ ...data, two: true }),
      async (data) => ({ ...data, three: true }),
      async (data) => ({ ...data, four: true }),
      async (data) => ({ ...data, five: true }),
    ]

    const [hasMigrated, res] = await migrateStorageData(migrations, storageData)

    expect(hasMigrated).toBe(true)
    expect(res).toEqual({
      dataVersion: 6,
      three: true,
      four: true,
      five: true,
    })
  })
})

describe('data migrations', () => {
  beforeEach(() => {
    resetUuidV4()
  })

  for (const [label, data] of [
    ['starting with nothing', {}],
    ['starting from v0', { dataVersion: 0, sites: [] }],
    ['starting from v1', { dataVersion: 1, warnings: [] }],
    ['starting from v2', { dataVersion: 2, warnings: [] }],
  ]) {
    it(`should start us off with a sane empty state (${label})`, async () => {
      const [, res] = await migrateStorageData(migrations, data)

      expect(res.warnings).toEqual([])
    })
  }

  for (const [label, data] of [
    [
      'starting from v0',
      {
        dataVersion: 0,
        sites: [
          { pattern: 'test1', warningStyle: 'border' },
          { pattern: 'test2', warningStyle: 'bottomBanner' },
          { pattern: 'test3', warningStyle: 'topBanner' },
        ],
      },
    ],
    [
      'starting from v1',
      {
        dataVersion: 1,
        warnings: [
          { pattern: 'test1', warningStyle: 'border' },
          { pattern: 'test2', warningStyle: 'bottomBanner' },
          { pattern: 'test3', warningStyle: 'topBanner' },
        ],
      },
    ],
  ]) {
    it(`should fill in default values (${label})`, async () => {
      for (const i of range(0, 4)) {
        uuidV4.mockImplementationOnce(() => `uuid-${i}`)
      }

      const [, res] = await migrateStorageData(migrations, data)

      expect(res.warnings).toEqual([
        {
          id: 'uuid-0',
          pattern: 'test1',
          warningStyle: 'border',
          borderColor: 'FF0000',
        },
        {
          id: 'uuid-1',
          pattern: 'test2',
          warningStyle: 'bottomBanner',
          text: 'Warning! This is Production!',
          backgroundColor: 'FF0000',
          textColor: 'FFFFFF',
        },
        {
          id: 'uuid-2',
          pattern: 'test3',
          warningStyle: 'topBanner',
          text: 'Warning! This is Production!',
          backgroundColor: 'FF0000',
          textColor: 'FFFFFF',
        },
      ])
    })
  }

  for (const [label, data] of [
    [
      'starting from v0',
      {
        dataVersion: 0,
        sites: [
          { pattern: 'test1', warningStyle: 'border' },
          { pattern: 'test2', warningStyle: 'border' },
        ],
      },
    ],
    [
      'starting from v1',
      {
        dataVersion: 1,
        warnings: [
          { pattern: 'test1', warningStyle: 'border' },
          { pattern: 'test2', warningStyle: 'border' },
        ],
      },
    ],
  ]) {
    it(`should convert numeric ids to unique ids (${label})`, async () => {
      // Duplicate ids are returned to test that the id generation is resistant
      // to hitting duplicates.
      uuidV4.mockImplementationOnce(() => 'uuid-1')
      uuidV4.mockImplementationOnce(() => 'uuid-1')
      uuidV4.mockImplementationOnce(() => 'uuid-2')
      uuidV4.mockImplementationOnce(() => 'uuid-2')

      const [, res] = await migrateStorageData(migrations, data)

      const warningIds = res.warnings.map((warning) => warning.id)
      expect(warningIds).toEqual(['uuid-1', 'uuid-2'])
    })
  }
})
