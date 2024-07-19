import { State } from './state'
import {
  type Warning,
  WarningStyle,
  type WarningWithId,
  CURRENT_DATA_VERSION,
  type AllData,
} from '../schema'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as uuid from 'uuid'

vi.mock('uuid', () => ({ v4: vi.fn() }))
const uuidV4 = vi.mocked(uuid.v4)
const _uuid = await vi.importActual<typeof uuid>('uuid')
type UuidV4Fn = typeof _uuid.v4

function resetUuidV4(): void {
  uuidV4.mockReset()
  uuidV4.mockImplementation(_uuid.v4)
}

const STUB_WARNING: Warning = {
  enabled: true,
  pattern: 'stub pattern',
  warningStyle: WarningStyle.Border,
  borderColor: 'fff',
}

function makeAllData(warnings: WarningWithId[] = []): AllData {
  return {
    dataVersion: CURRENT_DATA_VERSION,
    warnings,
  }
}

describe('state.ts', () => {
  beforeEach(() => {
    resetUuidV4()
  })

  describe('State', () => {
    it('should construct with the latest version', () => {
      const state = new State(makeAllData())
      expect(state.dataVersion).toBe(CURRENT_DATA_VERSION)
    })

    it('should construct with empty warnings', () => {
      const state = new State(makeAllData())
      expect(state.warnings.size).toBe(0)
    })

    it('should preload warnings when passed to constructor', () => {
      const warnings: WarningWithId[] = [
        {
          ...STUB_WARNING,
          id: 'id1',
        },
        {
          ...STUB_WARNING,
          id: 'id2',
        },
      ]

      const state = new State(makeAllData(warnings))

      expect(state.warnings).toEqual(
        new Map(
          Object.entries({
            id1: {
              ...STUB_WARNING,
            },
            id2: {
              ...STUB_WARNING,
            },
          }),
        ),
      )
    })

    describe('addWarning()', () => {
      it('should add to the warnings', () => {
        const state = new State(makeAllData())

        const createdWarning = state.addWarning({
          ...STUB_WARNING,
        })

        expect(createdWarning).toEqual({
          ...STUB_WARNING,
          id: createdWarning.id,
        })

        expect(state.warnings.size).toBe(1)
        expect(state.warnings.get(createdWarning.id)).toEqual(STUB_WARNING)
      })

      it('should not generate duplicate ids', () => {
        uuidV4.mockImplementationOnce((() => 'uuid-1') as UuidV4Fn)
        uuidV4.mockImplementationOnce((() => 'uuid-2') as UuidV4Fn)
        uuidV4.mockImplementationOnce((() => 'uuid-2') as UuidV4Fn)
        uuidV4.mockImplementationOnce((() => 'uuid-3') as UuidV4Fn)
        uuidV4.mockImplementationOnce((() => 'uuid-3') as UuidV4Fn)
        uuidV4.mockImplementationOnce((() => 'uuid-4') as UuidV4Fn)

        const state = new State(makeAllData())

        state.addWarning(STUB_WARNING)
        state.addWarning(STUB_WARNING)
        state.addWarning(STUB_WARNING)
        state.addWarning(STUB_WARNING)

        const ids = Array.from(state.warnings.keys()).sort()
        expect(ids).toEqual(['uuid-1', 'uuid-2', 'uuid-3', 'uuid-4'])
      })
    })

    describe('getWarning()', () => {
      it('should get by id', () => {
        const state = new State(
          makeAllData([{ ...STUB_WARNING, id: 'uuid-the-one' }]),
        )

        const res = state.getWarning('uuid-the-one')

        expect(res).toEqual({ ...STUB_WARNING, id: 'uuid-the-one' })
      })

      it('should return null if nothing is found', () => {
        const state = new State(
          makeAllData([{ ...STUB_WARNING, id: 'uuid-the-one' }]),
        )

        const res = state.getWarning('uuid-not-there')

        expect(res).toBe(undefined)
      })
    })

    describe('getAllWarnings()', () => {
      it('should return an empty list with no warnings', () => {
        const state = new State(makeAllData())
        expect(state.getAllWarnings()).toEqual([])
      })

      it('should return all warnings with their ids', () => {
        const state = new State(
          makeAllData([
            {
              ...STUB_WARNING,
              pattern: 'pattern 1',
              id: 'id1',
            },
            {
              ...STUB_WARNING,
              pattern: 'pattern 2',
              id: 'id2',
            },
          ]),
        )

        const res = state.getAllWarnings()

        expect(res).toEqual([
          {
            ...STUB_WARNING,
            pattern: 'pattern 1',
            id: 'id1',
          },
          {
            ...STUB_WARNING,
            pattern: 'pattern 2',
            id: 'id2',
          },
        ])
      })
    })

    describe('removeWarning()', () => {
      it('should remove by id', () => {
        const state = new State(
          makeAllData([{ ...STUB_WARNING, id: 'uuid-the-one' }]),
        )

        const res = state.removeWarning('uuid-the-one')

        expect(state.warnings.size).toBe(0)
        expect(res).toEqual({
          ...STUB_WARNING,
          id: 'uuid-the-one',
        })
      })

      it('should not remove when id does not match', () => {
        const state = new State(
          makeAllData([{ ...STUB_WARNING, id: 'uuid-the-one' }]),
        )

        const res = state.removeWarning('uuid-not-the-one')

        expect(state.warnings.size).toBe(1)
        expect(res).toBe(undefined)
      })
    })

    describe('updateWarning()', () => {
      it('should replace the value when id matches', () => {
        const state = new State(
          makeAllData([
            { ...STUB_WARNING, pattern: 'first', id: 'uuid-first' },
            { ...STUB_WARNING, pattern: 'second', id: 'uuid-second' },
          ]),
        )

        state.updateWarning('uuid-first', {
          ...STUB_WARNING,
          pattern: 'first updated',
        })

        expect(state.getWarning('uuid-first')).toEqual({
          ...STUB_WARNING,
          pattern: 'first updated',
          id: 'uuid-first',
        })
        expect(state.getWarning('uuid-second')).toEqual({
          ...STUB_WARNING,
          pattern: 'second',
          id: 'uuid-second',
        })
      })

      it('should do nothing when id does not exist', () => {
        const state = new State(
          makeAllData([
            { ...STUB_WARNING, pattern: 'first', id: 'uuid-first' },
            { ...STUB_WARNING, pattern: 'second', id: 'uuid-second' },
          ]),
        )

        state.updateWarning('uuid-not-there', {
          ...STUB_WARNING,
          pattern: 'first updated',
        })

        expect(state.getWarning('uuid-first')).toEqual({
          ...STUB_WARNING,
          pattern: 'first',
          id: 'uuid-first',
        })
        expect(state.getWarning('uuid-second')).toEqual({
          ...STUB_WARNING,
          pattern: 'second',
          id: 'uuid-second',
        })
      })
    })
  })

  describe('findMatchingWarnings()', () => {
    it('should return warnings where pattern matches url', () => {
      const state = new State(makeAllData())
      state.addWarning({ ...STUB_WARNING, pattern: 'fo' })
      state.addWarning({ ...STUB_WARNING, pattern: 'foo' })
      state.addWarning({ ...STUB_WARNING, pattern: 'bar' })
      state.addWarning({ ...STUB_WARNING, pattern: 'baz' })

      const matches = state.findMatchingWarnings('https://foobar.com')

      const patterns = matches.map((warning) => warning.pattern).sort()
      expect(patterns).toEqual(['bar', 'fo', 'foo'])
    })

    it('should return empty array with no matches', () => {
      const state = new State(makeAllData())
      state.addWarning({ ...STUB_WARNING, pattern: 'fo' })
      state.addWarning({ ...STUB_WARNING, pattern: 'foo' })
      state.addWarning({ ...STUB_WARNING, pattern: 'bar' })
      state.addWarning({ ...STUB_WARNING, pattern: 'baz' })

      const matches = state.findMatchingWarnings('https://something-else.com')

      const patterns = matches.map((warning) => warning.pattern).sort()
      expect(patterns).toEqual([])
    })

    it('should return empty array with no warnings', () => {
      const state = new State(makeAllData())

      const matches = state.findMatchingWarnings('https://something-else.com')

      expect(matches).toEqual([])
    })

    it('should ignore disabled warnings', () => {
      const state = new State(makeAllData())
      state.addWarning({ ...STUB_WARNING, pattern: 'foobar', enabled: false })

      const matches = state.findMatchingWarnings('https://something-else.com')

      expect(matches).toEqual([])
    })
  })

  describe('exportAllData()', () => {
    it('should split back all the internal data', () => {
      const state = new State(
        makeAllData([
          { ...STUB_WARNING, id: 'uuid-1', pattern: 'foo' },
          { ...STUB_WARNING, id: 'uuid-2', pattern: 'bar' },
          { ...STUB_WARNING, id: 'uuid-3', pattern: 'baz' },
        ]),
      )

      const res = state.exportAllData()

      expect(res).toEqual({
        dataVersion: CURRENT_DATA_VERSION,
        warnings: [
          {
            enabled: true,
            borderColor: 'fff',
            id: 'uuid-1',
            pattern: 'foo',
            warningStyle: 'border',
          },
          {
            enabled: true,
            borderColor: 'fff',
            id: 'uuid-2',
            pattern: 'bar',
            warningStyle: 'border',
          },
          {
            enabled: true,
            borderColor: 'fff',
            id: 'uuid-3',
            pattern: 'baz',
            warningStyle: 'border',
          },
        ],
      })
    })
  })
})
