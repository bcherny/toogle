import { test } from 'ava'
import { parse } from '../../src/adapters/typescript'

test('Main', t => {
  let r = parse(['./ast.ts'], '/Users/bcherny/Sites/toogle/src')
  t.is(r, null)
})
