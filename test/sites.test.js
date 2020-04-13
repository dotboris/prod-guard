import './test-helper'
import { expect } from 'chai'
import * as sites from '../src/sites'

describe('sites.js', () => {
  it('should start with an empty db', () => {
    const db = sites.createDb()

    const res = sites.getAll(db)

    expect(res).to.deep.eq([])
  })

  describe('add()', () => {
    it('should add to the sites', () => {
      const db = sites.createDb()

      sites.add(db, { phony: 1 })
      const res = sites.getAll(db)

      expect(res).to.have.lengthOf(1)
      expect(res[0]).to.have.property('phony', 1)
    })

    it('should not generate duplicate ids', () => {
      const db = sites.createDb()

      sites.add(db, {})
      sites.add(db, {})
      sites.add(db, {})
      sites.add(db, {})
      const res = sites.getAll(db)

      expect(res).to.have.lengthOf(4)
      const ids = Array.from(new Set(res.map(site => site.id)))
      expect(ids).to.have.lengthOf(4)
    })
  })

  describe('addAll()', () => {
    it('should add to the sites', () => {
      const db = sites.createDb()

      sites.addAll(db, [
        { phony: 'a' },
        { phony: 'b' },
        { phony: 'c' },
        { phony: 'd' }
      ])
      const res = sites.getAll(db)

      const phonies = res.map(site => site.phony)
      phonies.sort()
      expect(phonies).to.deep.eq(['a', 'b', 'c', 'd'])
    })

    it('should not generate duplicate ids', () => {
      const db = sites.createDb()

      sites.addAll(db, [{}, {}, {}, {}])
      const res = sites.getAll(db)

      expect(res).to.have.lengthOf(4)
      const ids = Array.from(new Set(res.map(site => site.id)))
      expect(ids).to.have.lengthOf(4)
    })
  })

  describe('get()', () => {
    it('should get by id', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      const res = sites.get(db, id)

      expect(res).to.have.property('phony', 42)
    })

    it('should not return id', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      const res = sites.get(db, id)

      expect(res).to.not.have.property('id')
    })

    it('should return null if nothing is found', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      const res = sites.get(db, id + 1)

      expect(res).to.be.null()
    })

    it('should not coerce between strings and numbers', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      const res = sites.get(db, String(id))

      expect(res).to.be.null()
    })
  })

  describe('remove()', () => {
    it('should remove by id', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      sites.remove(db, id)
      const res = sites.getAll(db)

      expect(res).to.be.deep.eq([])
    })

    it('should not remove when id does not match', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      sites.remove(db, id + 1)
      const res = sites.getAll(db)

      expect(res).to.have.lengthOf(1)
    })

    it('should not coerce between string and int ids', () => {
      const db = sites.createDb()
      sites.addAll(db, [{ phony: 42 }])
      const id = sites.getAll(db)[0].id

      sites.remove(db, String(id))
      const res = sites.getAll(db)

      expect(res).to.have.lengthOf(1)
    })
  })

  describe('update()', () => {
    it('should replace the value when id matches', () => {
      const db = sites.createDb()
      sites.addAll(db, [{}, {}])
      const [first, second] = sites.getAll(db)

      sites.update(db, first.id, { changed: true })

      const changed = sites.get(db, first.id)
      expect(changed).to.have.property('changed', true)
      const other = sites.get(db, second.id)
      expect(other).not.to.have.property('changed')
    })

    it('should do nothing when id does not exist', () => {
      const db = sites.createDb()
      sites.addAll(db, [{}, {}])
      const [first, second] = sites.getAll(db)

      sites.update(db, second.id + 20, { changed: true })

      const firstRes = sites.get(db, first.id)
      expect(firstRes).to.not.have.property('changed')
      const secondRes = sites.get(db, second.id)
      expect(secondRes).to.not.have.property('changed')
    })

    it('should not coerce between string and int ids', () => {
      const db = sites.createDb()
      sites.addAll(db, [{}, {}])
      const [first, second] = sites.getAll(db)

      sites.update(db, String(first.id), { changed: true })

      const firstRes = sites.get(db, first.id)
      expect(firstRes).to.not.have.property('changed')
      const secondRes = sites.get(db, second.id)
      expect(secondRes).to.not.have.property('changed')
    })
  })

  describe('findMatching()', () => {
    it('should return sites where pattern matches url', () => {
      const db = sites.createDb()
      sites.addAll(db, [
        { pattern: 'fo' },
        { pattern: 'foo' },
        { pattern: 'bar' },
        { pattern: 'baz' }
      ])

      const matches = sites.findMatching(db, 'https://foobar.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).to.deep.eq([
        'bar',
        'fo',
        'foo'
      ])
    })

    it('should return empty array with no matches', () => {
      const db = sites.createDb()
      sites.addAll(db, [
        { pattern: 'fo' },
        { pattern: 'foo' },
        { pattern: 'bar' },
        { pattern: 'baz' }
      ])

      const matches = sites.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).to.deep.eq([])
    })

    it('should return empty array with no sites', () => {
      const db = sites.createDb()

      const matches = sites.findMatching(db, 'https://something-else.com')

      const patterns = matches.map(site => site.pattern).sort()
      expect(patterns).to.deep.eq([])
    })
  })
})
