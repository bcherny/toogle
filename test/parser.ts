import { test } from 'ava'
import { Function0, Function1, Function2, Generic, Intersection, List, Simple, Union } from '../src/ast'
import { parse } from '../src/parser'

test('number', t =>
  t.deepEqual(parse('number'), Simple('number'))
)

test('number[]', t =>
  t.deepEqual(parse('number[]'), List(Simple('number')))
)

test('A[]', t =>
  t.deepEqual(parse('A[]'), List(Generic('A')))
)

test('Array<A>', t =>
  t.deepEqual(parse('Array<A>'), List(Generic('A')))
)

test('-> A', t =>
  t.deepEqual(parse('-> A'), Function0(Generic('A')))
)

test('A -> B', t =>
  t.deepEqual(parse('A -> B'), Function1(Generic('A'), Generic('B')))
)

// TODO
// test('A -> B -> C', t =>
//   t.deepEqual(parse('A -> B -> C'), Function1(Generic('A'), Function1(Generic('B'), Generic('C'))))
// )

test('A, B -> number', t => {
  let _ = Function2(Generic('A'), Generic('B'), Simple('number'))
  t.deepEqual(parse('A,B -> number'), _)
  t.deepEqual(parse('A, B -> number'), _)
  t.deepEqual(parse('A , B -> number'), _)
  t.deepEqual(parse('A   ,    B -> number'), _)
  t.deepEqual(parse('A B -> number'), _)
  t.deepEqual(parse('A   B -> number'), _)
})

test('A & B', t =>
  t.deepEqual(parse('A & B'), Intersection(Generic('A'), Generic('B')))
)

test('A | B', t =>
  t.deepEqual(parse('A | B'), Union(Generic('A'), Generic('B')))
)
