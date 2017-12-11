import { alt, createLanguage, optWhitespace, regexp, seqMap, string, TypedRule, whitespace } from 'parsimmon'

type Spec = {
  Fn: Spec['Fn0'] | Spec['Fn1'] | Spec['Fn2'] | Spec['Fn3'] | Spec['Fn4'] | Spec['Fn5']
  Fn0: Function0<any>
  Fn1: Function1<any, any>
  Fn2: Function2<any, any, any>
  Fn3: Function3<any, any, any, any>
  Fn4: Function4<any, any, any, any, any>
  Fn5: Function5<any, any, any, any, any, any>
  Generic: Generic
  Intersection: Intersection<any, any>
  List: List<any>
  Primitive: List<any> | Simple<Simples> | Generic
  Simple: Simple<Simples>
  Union: Union<any, any>
}

let Spec: TypedRule<Spec> = {

  Generic() {
    return regexp(/([A-Z][\w\d]*)/)
      .map(([A, b]) => Generic(A + (b || '')))
      .desc('Generic type (eg. "A")')
  },

  Fn(r) {
    return alt(r.Fn0, r.Fn1, r.Fn2, r.Fn3, r.Fn4, r.Fn5)
      .desc('Function')
  },

  // TODO: Change Primitive -> Node
  Fn0(r) {
    return seqMap(Arrow.then(r.Primitive), Function0)
  },
  Fn1(r) {
    return seqMap(r.Primitive.skip(Arrow), r.Primitive, Function1)
  },
  Fn2(r) {
    return seqMap(r.Primitive.skip(Div), r.Primitive.skip(Arrow), r.Primitive, Function2)
  },
  Fn3(r) {
    return seqMap(r.Primitive.skip(Div), r.Primitive.skip(Div), r.Primitive.skip(Arrow), r.Primitive, Function3)
  },
  Fn4(r) {
    return seqMap(r.Primitive.skip(Div), r.Primitive.skip(Div), r.Primitive.skip(Div), r.Primitive.skip(Arrow), r.Primitive, Function4)
  },
  Fn5(r) {
    return seqMap(r.Primitive.skip(Div), r.Primitive.skip(Div), r.Primitive.skip(Div), r.Primitive.skip(Div), r.Primitive.skip(Arrow), r.Primitive, Function5)
  },

  // TODO: Change Primitive -> Node
  Intersection(r) {
    return seqMap(
      r.Primitive.skip(optWhitespace).skip(string('&')).skip(optWhitespace),
      r.Primitive,
      Intersection
    )
    .desc('Intersection')
  },

  List(r) {
    return seqMap(alt(r.Simple, r.Generic), string('[]'), List)
      .desc('List')
  },

  Primitive(r) {
    return alt(r.List, r.Simple, r.Generic)
      .desc('List, Generic type, or Concrete type')
  },

  Simple() {
    return alt(
      string('boolean'),
      string('null'),
      string('number'),
      string('string'),
      string('undefined'),
      string('void')
    )
      .map(_ => Simple(_ as Simples))
      .desc('Concrete type')
  },

  // TODO: Change Primitive -> Node
  Union(r) {
    return seqMap(
      r.Primitive.skip(optWhitespace).skip(string('|')).skip(optWhitespace),
      r.Primitive,
      Union
    )
    .desc('Union')
  }
}

let Arrow = optWhitespace
  .then(alt(string('->'), string('=>')))
  .then(optWhitespace)
  .desc('Arrow')

let Div = alt(
    optWhitespace.then(string(',')).then(optWhitespace),
    whitespace.atLeast(1)
  )
  .desc(',')

let Language = createLanguage(Spec)

let Node = alt(
  Language.Intersection,
  Language.Union,
  Language.List,
  Language.Fn,
  Language.Simple,
  Language.Generic
)
  .desc('Node')

// let Expr = alt(
//   string('(').then(Node).skip(string(')')),
//   Node
// )

export function parse(input: string): Node {
  let r = Node.parse(input)
  if (r.status) {
    return r.value
  }
  throw {...r, given: input}
}

// Types

type Node = Spec[keyof Spec]

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

type Intersection<A extends Node, B extends Node> = {
  left: A
  right: B
  type: 'Intersection'
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

type Union<A extends Node, B extends Node> = {
  left: A
  right: B
  type: 'Union'
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

export function Intersection<A extends Node, B extends Node>(left: A, right: B): Intersection<A, B> {
  return { type: 'Intersection', left, right }
}

export function List<A extends Node>(of: A): List<A> {
  return { type: 'List', of }
}

export function Simple<A extends Simples>(of: A): Simple<A> {
  return { type: 'Simple', of }
}

export function Union<A extends Node, B extends Node>(left: A, right: B): Union<A, B> {
  return { type: 'Union', left, right }
}
