import * as Warnings from './warnings'

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
      const db = Warnings.createDb()

      Warnings.add(db, {})
      Warnings.add(db, {})
      Warnings.add(db, {})
      Warnings.add(db, {})
      const res = Warnings.getAll(db)

      expect(res).toHaveLength(4)
      const ids = Array.from(new Set(res.map(warning => warning.id)))
      expect(ids).toHaveLength(4)
    })
  })

  describe('addAll()', () => {
    it('should add to the warnings', () => {
      const db = Warnings.createDb()

      Warnings.addAll(db, [
        { phony: 'a' },
        { phony: 'b' },
        { phony: 'c' },
        { phony: 'd' }
      ])
      const res = Warnings.getAll(db)

      const phonies = res.map(warning => warning.phony)
      phonies.sort()
      expect(phonies).toEqual(['a', 'b', 'c', 'd'])
    })

    it('should not generate duplicate ids', () => {
      const db = Warnings.createDb()

      Warnings.addAll(db, [{}, {}, {}, {}])
      const res = Warnings.getAll(db)

      expect(res).toHaveLength(4)
      const ids = Array.from(new Set(res.map(warning => warning.id)))
      expect(ids).toHaveLength(4)
    })
  })

  describe('get()', () => {
    it('should get by id', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      const res = Warnings.get(db, id)

      expect(res).toHaveProperty('phony', 42)
    })

    it('should not return id', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      const res = Warnings.get(db, id)

      expect(res).not.toHaveProperty('id')
    })

    it('should return null if nothing is found', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      const res = Warnings.get(db, id + 1)

      expect(res).toBeNull()
    })

    it('should not coerce between strings and numbers', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      const res = Warnings.get(db, String(id))

      expect(res).toBeNull()
    })
  })

  describe('remove()', () => {
    it('should remove by id', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      Warnings.remove(db, id)
      const res = Warnings.getAll(db)

      expect(res).toEqual([])
    })

    it('should not remove when id does not match', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      Warnings.remove(db, id + 1)
      const res = Warnings.getAll(db)

      expect(res).toHaveLength(1)
    })

    it('should not coerce between string and int ids', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{ phony: 42 }])
      const id = Warnings.getAll(db)[0].id

      Warnings.remove(db, String(id))
      const res = Warnings.getAll(db)

      expect(res).toHaveLength(1)
    })
  })

  describe('update()', () => {
    it('should replace the value when id matches', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{}, {}])
      const [first, second] = Warnings.getAll(db)

      Warnings.update(db, first.id, { changed: true })

      const changed = Warnings.get(db, first.id)
      expect(changed).toHaveProperty('changed', true)
      const other = Warnings.get(db, second.id)
      expect(other).not.toHaveProperty('changed')
    })

    it('should do nothing when id does not exist', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{}, {}])
      const [first, second] = Warnings.getAll(db)

      Warnings.update(db, second.id + 20, { changed: true })

      const firstRes = Warnings.get(db, first.id)
      expect(firstRes).not.toHaveProperty('changed')
      const secondRes = Warnings.get(db, second.id)
      expect(secondRes).not.toHaveProperty('changed')
    })

    it('should not coerce between string and int ids', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [{}, {}])
      const [first, second] = Warnings.getAll(db)

      Warnings.update(db, String(first.id), { changed: true })

      const firstRes = Warnings.get(db, first.id)
      expect(firstRes).not.toHaveProperty('changed')
      const secondRes = Warnings.get(db, second.id)
      expect(secondRes).not.toHaveProperty('changed')
    })
  })

  describe('findMatching()', () => {
    it('should return warnings where pattern matches url', () => {
      const db = Warnings.createDb()
      Warnings.addAll(db, [
        { pattern: 'fo' },
        { pattern: 'foo' },
        { pattern: 'bar' },
        { pattern: 'baz' }
      ])

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
      Warnings.addAll(db, [
        { pattern: 'fo' },
        { pattern: 'foo' },
        { pattern: 'bar' },
        { pattern: 'baz' }
      ])

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
