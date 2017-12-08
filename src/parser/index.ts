import { alt, lazy, regexp, seqMap, string, whitespace } from 'parsimmon'

let simple = alt(
  string('boolean'),
  string('null'),
  string('number'),
  string('string'),
  string('undefined'),
  string('void')
).map(_ => Simple(_ as Simples))

let generic = regexp(/([A-Z][\w\d]*)/)
  .map(([A, b]) => Generic(A + (b || '')))
  .desc('Generic type variable (eg. "A")')

let list = seqMap(simple.or(generic), string('[]'), List)
let primitive = lazy(() => alt(list, simple, generic))

let space = whitespace.many()
let arrow = space.then(string('->').or(string('=>')).skip(space)).desc('Arrow')
let div = space.or(space.then(string(',')).skip(space)).desc(',')
let fn0 = seqMap(arrow.then(primitive), Function0)
let fn1 = seqMap(primitive.skip(arrow), primitive, Function1)
let fn2 = seqMap(primitive.skip(div), primitive.skip(arrow), primitive, Function2)
let fn3 = seqMap(primitive.skip(div), primitive.skip(div), primitive.skip(arrow), primitive, Function3)
let fn4 = seqMap(primitive.skip(div), primitive.skip(div), primitive.skip(div), primitive.skip(arrow), primitive, Function4)
let fn5 = seqMap(primitive.skip(div), primitive.skip(div), primitive.skip(div), primitive.skip(div), primitive.skip(arrow), primitive, Function5)
let fn = alt(fn0, fn1, fn2, fn3, fn4, fn5)

let node = alt(fn, list, simple, generic)

export function parse(input: string): Node {
  let r = node.parse(input)
  if (r.status) {
    return r.value
  }
  throw r.expected
}

// Queries

// type Query = { thisType: Node }
//   | { arg0: Node }
//   | { arg0: Node, arg1: Node }
//   | { arg0: Node, arg1: Node, arg2: Node }
//   | { arg0: Node, arg1: Node, arg2: Node, arg3: Node }
//   | { arg0: Node, arg1: Node, arg2: Node, arg3: Node, arg4: Node }
//   | { arg0: Node, arg1: Node, arg2: Node, arg3: Node, arg4: Node, arg5: Node }
//   | { arg0: Node, arg1: Node, arg2: Node, arg3: Node, arg4: Node, arg5: Node, arg6: Node }
//   | { arg0: Node, arg1: Node, arg2: Node, arg3: Node, arg4: Node, arg5: Node, arg6: Node, arg7: Node }

// Types

type Node = Function0<any>
  | Function1<any, any>
  | Function2<any, any, any>
  | Function3<any, any, any, any>
  | Function4<any, any, any, any, any>
  | Function5<any, any, any, any, any, any>
  | Generic
  | List<any>
  | Simple<any>

type Function0<A extends Node> = {
  to: A
  type: 'Function0'
}

type Function1<A extends Node, B extends Node> = {
  from1: A
  to: B
  type: 'Function1'
}

type Function2<A extends Node, B extends Node, C extends Node> = {
  from1: A
  from2: B
  to: C
  type: 'Function2'
}

type Function3<A extends Node, B extends Node, C extends Node, D extends Node> = {
  from1: A
  from2: B
  from3: C
  to: D
  type: 'Function3'
}

type Function4<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node> = {
  from1: A
  from2: B
  from3: C
  from4: D
  to: E
  type: 'Function4'
}

type Function5<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node> = {
  from1: A
  from2: B
  from3: C
  from4: D
  from5: E
  to: F
  type: 'Function5'
}

type Generic = {
  name: string
  type: 'Generic'
}

type Simple<A extends Simples> = {
  of: A
  type: 'Simple'
}

type Simples = 'boolean' | 'number' | 'null' | 'string' | 'undefined' | 'void'

type List<A extends Node> = {
  of: A
  type: 'List'
}

export function Function0<A extends Node>(to: A): Function0<A> {
  return { type: 'Function0', to }
}

export function Function1<A extends Node, B extends Node>(from1: A, to: B): Function1<A, B> {
  return { type: 'Function1', from1, to }
}

export function Function2<A extends Node, B extends Node, C extends Node>(from1: A, from2: B, to: C): Function2<A, B, C> {
  return { type: 'Function2', from1, from2, to }
}

export function Function3<A extends Node, B extends Node, C extends Node, D extends Node>(from1: A, from2: B, from3: C, to: D): Function3<A, B, C, D> {
  return { type: 'Function3', from1, from2, from3, to }
}

export function Function4<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node>(from1: A, from2: B, from3: C, from4: D, to: E): Function4<A, B, C, D, E> {
  return { type: 'Function4', from1, from2, from3, from4, to }
}

export function Function5<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node>(from1: A, from2: B, from3: C, from4: D, from5: E, to: F): Function5<A, B, C, D, E, F> {
  return { type: 'Function5', from1, from2, from3, from4, from5, to }
}

export function Generic(name: string): Generic {
  return { type: 'Generic', name }
}

export function List<A extends Node>(of: A): List<A> {
  return { type: 'List', of }
}

export function Simple<A extends Simples>(of: A): Simple<A> {
  return { type: 'Simple', of }
}
