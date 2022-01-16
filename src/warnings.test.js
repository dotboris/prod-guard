import { sortBy } from 'lodash'
import { v4 as uuidV4 } from 'uuid'
import * as Warnings from './warnings'

jest.mock('uuid', () => {
  const { v4: realUuidV4 } = jest.requireActual('uuid')
  return {
    v4: jest.fn(() => realUuidV4())
  }
})

describe('warnings.js', () => {
  it('should start with an empty db', () => {
    const db = Warnings.createDb()

    const res = Warnings.getAll(db)

    expect(res).toEqual([])
  })

  describe('add()', () => {
    it('should add to the warnings', () => {
      const db = Warnings.createDb()

      Warnings.add(db, { phony: 1 })

      const res = Warnings.getAll(db)

      expect(res).toHaveLength(1)
      expect(res[0]).toHaveProperty('phony', 1)
    })

    it('should not generate duplicate ids', () => {
      uuidV4.mockImplementationOnce(() => 'uuid-1')
      uuidV4.mockImplementationOnce(() => 'uuid-2')
      uuidV4.mockImplementationOnce(() => 'uuid-2')
      uuidV4.mockImplementationOnce(() => 'uuid-3')
      uuidV4.mockImplementationOnce(() => 'uuid-3')
      uuidV4.mockImplementationOnce(() => 'uuid-4')

      const db = Warnings.createDb()

      Warnings.add(db, {})
      Warnings.add(db, {})
      Warnings.add(db, {})
      Warnings.add(db, {})
      const res = Warnings.getAll(db)

      const ids = res.map(warning => warning.id)
      ids.sort()
      expect(ids).toEqual(['uuid-1', 'uuid-2', 'uuid-3', 'uuid-4'])
    })
  })

  describe('importAll()', () => {
    it('should add to the warnings', () => {
      const db = Warnings.createDb()

      Warnings.importAll(db, [
        { id: 'uuid-one', phony: 'a' },
        { id: 'uuid-two', phony: 'b' },
        { id: 'uuid-three', phony: 'c' },
        { id: 'uuid-four', phony: 'd' }
      ])

      let warnings = Warnings.getAll(db)
      warnings = sortBy(warnings, w => w.phony)
      expect(warnings).toEqual([
        { id: 'uuid-one', phony: 'a' },
        { id: 'uuid-two', phony: 'b' },
        { id: 'uuid-three', phony: 'c' },
        { id: 'uuid-four', phony: 'd' }
      ])
    })

    it('should overwrite anything with existing id', () => {
      const db = Warnings.createDb()

      Warnings.importAll(db, [
        { id: 'uuid-one', phony: 'a' },
        { id: 'uuid-two', phony: 'b' },
        { id: 'uuid-three', phony: 'c' },
        { id: 'uuid-four', phony: 'd' }
      ])

      Warnings.importAll(db, [
        { id: 'uuid-two', phony: 'b', overwritten: true },
        { id: 'uuid-three', phony: 'c', overwritten: true }
      ])

      let warnings = Warnings.getAll(db)
      warnings = sortBy(warnings, w => w.phony)
      expect(warnings).toEqual([
        { id: 'uuid-one', phony: 'a' },
        { id: 'uuid-two', phony: 'b', overwritten: true },
        { id: 'uuid-three', phony: 'c', overwritten: true },
        { id: 'uuid-four', phony: 'd' }
      ])
    })
  })

  describe('get()', () => {
    it('should get by id', () => {
      const db = Warnings.createDb()
      Warnings.importAll(db, [{ id: 'uuid-the-one', phony: 42 }])

      const res = Warnings.get(db, 'uuid-the-one')

      expect(res).toHaveProperty('phony', 42)
    })

    it('should return null if nothing is found', () => {
      const db = Warnings.createDb()
      Warnings.importAll(db, [{ id: 'uuid-the-one', phony: 42 }])

      const res = Warnings.get(db, 'uuid-not-the-one')

      expect(res).toBeNull()
    })
  })

  describe('remove()', () => {
    it('should remove by id', () => {
      const db = Warnings.createDb()
      Warnings.importAll(db, [{ id: 'uuid-the-one', phony: 42 }])

      Warnings.remove(db, 'uuid-the-one')
      const res = Warnings.getAll(db)

      expect(res).toEqual([])
    })

    it('should not remove when id does not match', () => {
      const db = Warnings.createDb()
      Warnings.importAll(db, [{ id: 'uuid-the-one', phony: 42 }])

      Warnings.remove(db, 'uuid-not-the-one')
      const res = Warnings.getAll(db)

      expect(res).toHaveLength(1)
    })
  })

  describe('update()', () => {
    it('should replace the value when id matches', () => {
      const db = Warnings.createDb()
      Warnings.importAll(db, [{ id: 'uuid-first' }, { id: 'uuid-second' }])
      const [first, second] = Warnings.getAll(db)

      Warnings.update(db, first.id, { changed: true })

      const changed = Warnings.get(db, first.id)
      expect(changed).toHaveProperty('changed', true)
      const other = Warnings.get(db, second.id)
      expect(other).not.toHaveProperty('changed')
    })

    it('should do nothing when id does not exist', () => {
      const db = Warnings.createDb()
      Warnings.importAll(db, [{ id: 'uuid-first' }, { id: 'uuid-second' }])
      const [first, second] = Warnings.getAll(db)

      Warnings.update(db, 'uuid-third', { changed: true })

      const firstRes = Warnings.get(db, first.id)
      expect(firstRes).not.toHaveProperty('changed')
      const secondRes = Warnings.get(db, second.id)
      expect(secondRes).not.toHaveProperty('changed')
    })
  })

  describe('findMatching()', () => {
    it('should return warnings where pattern matches url', () => {
      const db = Warnings.createDb()
      Warnings.add(db, { pattern: 'fo' })
      Warnings.add(db, { pattern: 'foo' })
      Warnings.add(db, { pattern: 'bar' })
      Warnings.add(db, { pattern: 'baz' })

      const matches = Warnings.findMatching(db, 'https://foobar.com')

      const patterns = matches.map(warning => warning.pattern).sort()
      expect(patterns).toEqual([
        'bar',
        'fo',
        'foo'
      ])
    })

    it('should return empty array with no matches', () => {
      const db = Warnings.createDb()
      Warnings.add(db, { pattern: 'fo' })
      Warnings.add(db, { pattern: 'foo' })
      Warnings.add(db, { pattern: 'bar' })
      Warnings.add(db, { pattern: 'baz' })

      const matches = Warnings.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(warning => warning.pattern).sort()
      expect(patterns).toEqual([])
    })

    it('should return empty array with no warnings', () => {
      const db = Warnings.createDb()

      const matches = Warnings.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(warning => warning.pattern).sort()
      expect(patterns).toEqual([])
    })
  })
})
