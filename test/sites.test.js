import './test-helper'
import { expect } from 'chai'
import * as Sites from '../src/sites'

describe('sites.js', () => {
  it('should start with an empty db', () => {
    const db = Sites.createDb()

    const res = Sites.getAll(db)

    expect(res).to.deep.eq([])
  })

  describe('add()', () => {
    it('should add to the sites', () => {
      const db = Sites.createDb()

      Sites.add(db, { phony: 1 })
      const res = Sites.getAll(db)

      expect(res).to.have.lengthOf(1)
      expect(res[0]).to.have.property('phony', 1)
    })

    it('should not generate duplicate ids', () => {
      const db = Sites.createDb()

      Sites.add(db, {})
      Sites.add(db, {})
      Sites.add(db, {})
      Sites.add(db, {})
      const res = Sites.getAll(db)

      expect(res).to.have.lengthOf(4)
      const ids = Array.from(new Set(res.map(site => site.id)))
      expect(ids).to.have.lengthOf(4)
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
      expect(phonies).to.deep.eq(['a', 'b', 'c', 'd'])
    })

    it('should not generate duplicate ids', () => {
      const db = Sites.createDb()

      Sites.addAll(db, [{}, {}, {}, {}])
      const res = Sites.getAll(db)

      expect(res).to.have.lengthOf(4)
      const ids = Array.from(new Set(res.map(site => site.id)))
      expect(ids).to.have.lengthOf(4)
    })
  })

  describe('get()', () => {
    it('should get by id', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, id)

      expect(res).to.have.property('phony', 42)
    })

    it('should not return id', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, id)

      expect(res).to.not.have.property('id')
    })

    it('should return null if nothing is found', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, id + 1)

      expect(res).to.be.null()
    })

    it('should not coerce between strings and numbers', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      const res = Sites.get(db, String(id))

      expect(res).to.be.null()
    })
  })

  describe('remove()', () => {
    it('should remove by id', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      Sites.remove(db, id)
      const res = Sites.getAll(db)

      expect(res).to.be.deep.eq([])
    })

    it('should not remove when id does not match', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      Sites.remove(db, id + 1)
      const res = Sites.getAll(db)

      expect(res).to.have.lengthOf(1)
    })

    it('should not coerce between string and int ids', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{ phony: 42 }])
      const id = Sites.getAll(db)[0].id

      Sites.remove(db, String(id))
      const res = Sites.getAll(db)

      expect(res).to.have.lengthOf(1)
    })
  })

  describe('update()', () => {
    it('should replace the value when id matches', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{}, {}])
      const [first, second] = Sites.getAll(db)

      Sites.update(db, first.id, { changed: true })

      const changed = Sites.get(db, first.id)
      expect(changed).to.have.property('changed', true)
      const other = Sites.get(db, second.id)
      expect(other).not.to.have.property('changed')
    })

    it('should do nothing when id does not exist', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{}, {}])
      const [first, second] = Sites.getAll(db)

      Sites.update(db, second.id + 20, { changed: true })

      const firstRes = Sites.get(db, first.id)
      expect(firstRes).to.not.have.property('changed')
      const secondRes = Sites.get(db, second.id)
      expect(secondRes).to.not.have.property('changed')
    })

    it('should not coerce between string and int ids', () => {
      const db = Sites.createDb()
      Sites.addAll(db, [{}, {}])
      const [first, second] = Sites.getAll(db)

      Sites.update(db, String(first.id), { changed: true })

      const firstRes = Sites.get(db, first.id)
      expect(firstRes).to.not.have.property('changed')
      const secondRes = Sites.get(db, second.id)
      expect(secondRes).to.not.have.property('changed')
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
      expect(patterns).to.deep.eq([
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
      expect(patterns).to.deep.eq([])
    })

    it('should return empty array with no sites', () => {
      const db = Sites.createDb()

      const matches = Sites.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).to.deep.eq([])
    })
  })
})
