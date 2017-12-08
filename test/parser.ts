import { test } from 'ava'
import { Generic, List, parse, Simple } from '../src/parser'

test('number', t =>
  t.deepEqual(parse('number'), Simple('number'))
)

test('number[]', t =>
  t.deepEqual(parse('number[]'), List(Simple('number')))
)

test('A[]', t =>
  t.deepEqual(parse('A[]'), List(Generic('A')))
)
