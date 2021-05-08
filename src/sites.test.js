import * as Sites from '../src/sites'

describe('sites.js', () => {
  it('should start with an empty db', () => {
    const db = Sites.createDb()

    const res = Sites.getAll(db)

    expect(res).toEqual([])
  })

  describe('add()', () => {
    it('should add to the sites', () => {
      const db = Sites.createDb()

      Sites.add(db, { phony: 1 })

      const res = Sites.getAll(db)

      expect(res).toHaveLength(1)
      expect(res[0]).toHaveProperty('phony', 1)
    })

    it('should not generate duplicate ids', () => {
      const db = Sites.createDb()

      Sites.add(db, {})
      Sites.add(db, {})
      Sites.add(db, {})
      Sites.add(db, {})
      const res = Sites.getAll(db)

      expect(res).toHaveLength(4)
      const ids = Array.from(new Set(res.map(site => site.id)))
      expect(ids).toHaveLength(4)
    })
  })

  describe('addAll()', () => {
    it('should add to the sites', () => {
      const db = Sites.createDb()

      Sites.addAll(db, [
        { phony: 'a' },
        { phony: 'b' },
        { phony: 'c' },
        { phony: 'd' }
      ])
      const res = Sites.getAll(db)

      const phonies = res.map(site => site.phony)
      phonies.sort()
      expect(phonies).toEqual(['a', 'b', 'c', 'd'])
    })

    it('should not generate duplicate ids', () => {
      const db = Sites.createDb()

      Sites.addAll(db, [{}, {}, {}, {}])
      const res = Sites.getAll(db)

      expect(res).toHaveLength(4)
      const ids = Array.from(new Set(res.map(site => site.id)))
      expect(ids).toHaveLength(4)
    })
  })

  describe('get()', () => {
    it('should get by id', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, id)

      expect(res).toHaveProperty('phony', 42)
    })

    it('should not return id', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, id)

      expect(res).not.toHaveProperty('id')
    })

    it('should return null if nothing is found', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, id + 1)

      expect(res).toBeNull()
    })

    it('should not coerce between strings and numbers', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, String(id))

      expect(res).toBeNull()
    })
  })

  describe('remove()', () => {
    it('should remove by id', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      Sites.remove(db, id)
      const res = Sites.getAll(db)

      expect(res).toEqual([])
    })

    it('should not remove when id does not match', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      Sites.remove(db, id + 1)
      const res = Sites.getAll(db)

      expect(res).toHaveLength(1)
    })

    it('should not coerce between string and int ids', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      Sites.remove(db, String(id))
      const res = Sites.getAll(db)

      expect(res).toHaveLength(1)
    })
  })

  describe('update()', () => {
    it('should replace the value when id matches', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{}, {}])
      const [first, second] = Sites.getAll(db)

      Sites.update(db, first.id, { changed: true })

      const changed = Sites.get(db, first.id)
      expect(changed).toHaveProperty('changed', true)
      const other = Sites.get(db, second.id)
      expect(other).not.toHaveProperty('changed')
    })

    it('should do nothing when id does not exist', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{}, {}])
      const [first, second] = Sites.getAll(db)

      Sites.update(db, second.id + 20, { changed: true })

      const firstRes = Sites.get(db, first.id)
      expect(firstRes).not.toHaveProperty('changed')
      const secondRes = Sites.get(db, second.id)
      expect(secondRes).not.toHaveProperty('changed')
    })

    it('should not coerce between string and int ids', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{}, {}])
      const [first, second] = Sites.getAll(db)

      Sites.update(db, String(first.id), { changed: true })

      const firstRes = Sites.get(db, first.id)
      expect(firstRes).not.toHaveProperty('changed')
      const secondRes = Sites.get(db, second.id)
      expect(secondRes).not.toHaveProperty('changed')
    })
  })

  describe('findMatching()', () => {
    it('should return sites where pattern matches url', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [
        { pattern: 'fo' },
        { pattern: 'foo' },
        { pattern: 'bar' },
        { pattern: 'baz' }
      ])

      const matches = Sites.findMatching(db, 'https://foobar.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).toEqual([
        'bar',
        'fo',
        'foo'
      ])
    })

    it('should return empty array with no matches', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [
        { pattern: 'fo' },
        { pattern: 'foo' },
        { pattern: 'bar' },
        { pattern: 'baz' }
      ])

      const matches = Sites.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).toEqual([])
    })

    it('should return empty array with no sites', () => {
      const db = Sites.createDb()

      const matches = Sites.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).toEqual([])
    })
  })
})
