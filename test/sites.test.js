import './test-helper'
import { expect } from 'chai'
import * as sites from '../src/sites'

describe('sites.js', () => {
  describe('createDb()', () => {
    it('should return an empty db', () => {
      const res = sites.createDb()

      expect(res).to.deep.eq(new Map())
    })
  })
})
