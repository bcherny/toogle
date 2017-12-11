import { alt, createLanguage, optWhitespace, regexp, seqMap, string, TypedRule, whitespace } from 'parsimmon'

type Spec = {
  Arrow: string
  Div: string
  Fn: Spec['Fn0'] | Spec['Fn1'] | Spec['Fn2'] | Spec['Fn3'] | Spec['Fn4'] | Spec['Fn5']
  Fn0: Function0<any>
  Fn1: Function1<any, any>
  Fn2: Function2<any, any, any>
  Fn3: Function3<any, any, any, any>
  Fn4: Function4<any, any, any, any, any>
  Fn5: Function5<any, any, any, any, any, any>
  Generic: Generic
  List: List<any>
  Node: Node
  Primitive: List<any> | Simple<Simples> | Generic
  Simple: Simple<Simples>
}

let Lang: TypedRule<Spec> = {
  Simple() {
    return alt(
      string('boolean'),
      string('null'),
      string('number'),
      string('string'),
      string('undefined'),
      string('void')
    ).map(_ => Simple(_ as Simples))
  },

  Generic() {
    return regexp(/([A-Z][\w\d]*)/)
      .map(([A, b]) => Generic(A + (b || '')))
  },

  Arrow() {
    return optWhitespace.then(alt(string('->'), string('=>'))).then(optWhitespace).desc('Arrow')
  },

  Div() {
    return alt(
      optWhitespace.then(string(',')).then(optWhitespace),
      whitespace.atLeast(1)
    )
    .desc(',')
  },

  Fn(r) {
    return alt(r.Fn0, r.Fn1, r.Fn2, r.Fn3, r.Fn4, r.Fn5)
  },

  Fn0(r) {
    return seqMap(r.Arrow.then(r.Primitive), Function0)
  },
  Fn1(r) {
    return seqMap(r.Primitive.skip(r.Arrow), r.Primitive, Function1)
  },
  Fn2(r) {
    return seqMap(r.Primitive.skip(r.Div), r.Primitive.skip(r.Arrow), r.Primitive, Function2)
  },
  Fn3(r) {
    return seqMap(r.Primitive.skip(r.Div), r.Primitive.skip(r.Div), r.Primitive.skip(r.Arrow), r.Primitive, Function3)
  },
  Fn4(r) {
    return seqMap(r.Primitive.skip(r.Div), r.Primitive.skip(r.Div), r.Primitive.skip(r.Div), r.Primitive.skip(r.Arrow), r.Primitive, Function4)
  },
  Fn5(r) {
    return seqMap(r.Primitive.skip(r.Div), r.Primitive.skip(r.Div), r.Primitive.skip(r.Div), r.Primitive.skip(r.Div), r.Primitive.skip(r.Arrow), r.Primitive, Function5)
  },

  List(r) {
    return seqMap(alt(r.Simple, r.Generic), string('[]'), List)
  },

  Node(r) {
    return alt(r.Fn, r.List, r.Simple, r.Generic)
  },

  Primitive(r) {
    return alt(r.List, r.Simple, r.Generic)
  }
}

let Language = createLanguage(Lang)

export function parse(input: string): Node {
  let r = Language.Node.parse(input)
  if (r.status) {
    return r.value
  }
  throw r.expected
}

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
