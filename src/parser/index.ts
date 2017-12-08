import { alt, regexp, seq, string } from 'parsimmon'

let simple = alt(
  string('boolean'),
  string('null'),
  string('number'),
  string('string'),
  string('undefined'),
  string('void')
).map((_: any) => Simple(_)) // TODO

let generic = regexp(/([A-Z][\w\d]*)/)
  .map(([A, b]) => Generic(A + (b || '')))

let type = alt(simple, generic)

let list = seq(type, string('[]'))
  .map(([a]) => List(a))

export function parse(input: string): Node {
  let r = alt(list, type).parse(input)
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

type Node = Function1<any, any>
  | Function2<any, any, any>
  | Function3<any, any, any, any>
  | Function4<any, any, any, any, any>
  | Function5<any, any, any, any, any, any>
  | Generic
  | List<any>
  | Simple<any>

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
