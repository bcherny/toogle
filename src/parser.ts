import { alt, createLanguage, optWhitespace, regexp, seqMap, string, TypedRule, whitespace } from 'parsimmon'
import { Function0, Function1, Function2, Function3, Function4, Function5, Generic, Intersection, List, Node, Simple, SimpleTypeString, Types, Union } from './ast'

let Spec: TypedRule<Types> = {

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

  // TODO: Change alt(r.Simple, r.Generic) -> Node
  List(r) {
    let compactList = seqMap(alt(r.Simple, r.Generic), string('[]'), List)
      .desc('List (compact T[] syntax')
    let verboseList = seqMap(string('Array<').then(alt(r.Simple, r.Generic)).skip(string('>')), List)
      .desc('List (verbose Array<T> syntax')
    return alt(compactList, verboseList)
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
      .map(_ => Simple(_ as SimpleTypeString))
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

export function parse(input: string): Node {
  let r = Node.parse(input)
  if (r.status) {
    return r.value
  }
  throw {...r, given: input}
}
