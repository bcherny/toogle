export type Types = {
  Fn: Types['Fn0'] | Types['Fn1'] | Types['Fn2'] | Types['Fn3'] | Types['Fn4'] | Types['Fn5']
  Fn0: Function0<any>
  Fn1: Function1<any, any>
  Fn2: Function2<any, any, any>
  Fn3: Function3<any, any, any, any>
  Fn4: Function4<any, any, any, any, any>
  Fn5: Function5<any, any, any, any, any, any>
  Generic: Generic
  Intersection: Intersection<any, any>
  List: List<any>
  Primitive: List<any> | Simple<SimpleTypeString> | Generic
  Simple: Simple<SimpleTypeString>
  Union: Union<any, any>
}

// Types

export type Node = Types[keyof Types]

export type Function0<A extends Node> = {
  to: A
  type: 'Function0'
}

export type Function1<A extends Node, B extends Node> = {
  from1: A
  to: B
  type: 'Function1'
}

export type Function2<A extends Node, B extends Node, C extends Node> = {
  from1: A
  from2: B
  to: C
  type: 'Function2'
}

export type Function3<A extends Node, B extends Node, C extends Node, D extends Node> = {
  from1: A
  from2: B
  from3: C
  to: D
  type: 'Function3'
}

export type Function4<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node> = {
  from1: A
  from2: B
  from3: C
  from4: D
  to: E
  type: 'Function4'
}

export type Function5<A extends Node, B extends Node, C extends Node, D extends Node, E extends Node, F extends Node> = {
  from1: A
  from2: B
  from3: C
  from4: D
  from5: E
  to: F
  type: 'Function5'
}

export type Generic = {
  name: string
  type: 'Generic'
}

export type Intersection<A extends Node, B extends Node> = {
  left: A
  right: B
  type: 'Intersection'
}

export type Simple<A extends SimpleTypeString> = {
  of: A
  type: 'Simple'
}

export type SimpleTypeString = 'boolean' | 'number' | 'null' | 'string' | 'undefined' | 'void'

export type List<A extends Node> = {
  of: A
  type: 'List'
}

export type Union<A extends Node, B extends Node> = {
  left: A
  right: B
  type: 'Union'
}

// AST generation

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

export function Intersection<A extends Node, B extends Node>(left: A, right: B): Intersection<A, B> {
  return { type: 'Intersection', left, right }
}

export function List<A extends Node>(of: A): List<A> {
  return { type: 'List', of }
}

export function Simple<A extends SimpleTypeString>(of: A): Simple<A> {
  return { type: 'Simple', of }
}

export function Union<A extends Node, B extends Node>(left: A, right: B): Union<A, B> {
  return { type: 'Union', left, right }
}
