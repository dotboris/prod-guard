import { migrateStorageData } from '.'
import * as uuid from 'uuid'
import { range } from 'lodash-es'

jest.mock('uuid', () => ({ v4: jest.fn() }))
const uuidV4 = jest.mocked(uuid.v4)
const _uuid = jest.requireActual<typeof uuid>('uuid')

function resetUuidV4(): void {
  uuidV4.mockReset()
  uuidV4.mockImplementation(() => _uuid.v4())
}

describe('data migrations', () => {
  beforeEach(() => {
    resetUuidV4()
  })

  for (const [label, data] of Object.entries({
    'starting with nothing': {},
    'starting from v0': { dataVersion: 0, sites: [] },
    'starting from v1': { dataVersion: 1, warnings: [] },
    'starting from v2': { dataVersion: 2, warnings: [] },
  })) {
    it(`should start us off with a sane empty state (${label})`, async () => {
      const [, res] = await migrateStorageData(data)

      expect(res.warnings).toEqual([])
    })
  }

  for (const [label, data] of Object.entries({
    'starting from v0': {
      dataVersion: 0,
      sites: [
        { pattern: 'test1', warningStyle: 'border' },
        { pattern: 'test2', warningStyle: 'bottomBanner' },
        { pattern: 'test3', warningStyle: 'topBanner' },
      ],
    },
    'starting from v1': {
      dataVersion: 1,
      warnings: [
        { pattern: 'test1', warningStyle: 'border' },
        { pattern: 'test2', warningStyle: 'bottomBanner' },
        { pattern: 'test3', warningStyle: 'topBanner' },
      ],
    },
  })) {
    it(`should fill in default values (${label})`, async () => {
      for (const i of range(0, 4)) {
        uuidV4.mockImplementationOnce(() => `uuid-${i}`)
      }

      const [, res] = await migrateStorageData(data)

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

  for (const [label, data] of Object.entries({
    'starting from v0': {
      dataVersion: 0,
      sites: [
        {
          pattern: 'test1',
          warningStyle: 'border',
          borderColor: 'no touching',
        },
        {
          pattern: 'test2',
          warningStyle: 'bottomBanner',
          text: 'no touching',
          textColor: 'no touching',
          backgroundColor: 'no touching',
        },
        {
          pattern: 'test3',
          warningStyle: 'topBanner',
          text: 'no touching',
          textColor: 'no touching',
          backgroundColor: 'no touching',
        },
      ],
    },
    'starting from v1': {
      dataVersion: 1,
      warnings: [
        {
          pattern: 'test1',
          warningStyle: 'border',
          borderColor: 'no touching',
        },
        {
          pattern: 'test2',
          warningStyle: 'bottomBanner',
          text: 'no touching',
          textColor: 'no touching',
          backgroundColor: 'no touching',
        },
        {
          pattern: 'test3',
          warningStyle: 'topBanner',
          text: 'no touching',
          textColor: 'no touching',
          backgroundColor: 'no touching',
        },
      ],
    },
  })) {
    it(`should leave existing options around (${label})`, async () => {
      for (const i of range(0, 4)) {
        uuidV4.mockImplementationOnce(() => `uuid-${i}`)
      }

      const [, res] = await migrateStorageData(data)

      expect(res.warnings).toEqual([
        {
          id: 'uuid-0',
          pattern: 'test1',
          warningStyle: 'border',
          borderColor: 'no touching',
        },
        {
          id: 'uuid-1',
          pattern: 'test2',
          warningStyle: 'bottomBanner',
          text: 'no touching',
          backgroundColor: 'no touching',
          textColor: 'no touching',
        },
        {
          id: 'uuid-2',
          pattern: 'test3',
          warningStyle: 'topBanner',
          text: 'no touching',
          backgroundColor: 'no touching',
          textColor: 'no touching',
        },
      ])
    })
  }

  for (const [label, data] of Object.entries({
    'starting from v0': {
      dataVersion: 0,
      sites: [
        { pattern: 'test1', warningStyle: 'border' },
        { pattern: 'test2', warningStyle: 'border' },
      ],
    },
    'starting from v1': {
      dataVersion: 1,
      warnings: [
        { pattern: 'test1', warningStyle: 'border' },
        { pattern: 'test2', warningStyle: 'border' },
      ],
    },
  })) {
    it(`should convert numeric ids to unique ids (${label})`, async () => {
      // Duplicate ids are returned to test that the id generation is resistant
      // to hitting duplicates.
      uuidV4.mockImplementationOnce(() => 'uuid-1')
      uuidV4.mockImplementationOnce(() => 'uuid-1')
      uuidV4.mockImplementationOnce(() => 'uuid-2')
      uuidV4.mockImplementationOnce(() => 'uuid-2')

      const [, res] = await migrateStorageData(data)

      const warningIds = res.warnings.map((warning) => warning.id)
      expect(warningIds).toEqual(['uuid-1', 'uuid-2'])
    })
  }
})
