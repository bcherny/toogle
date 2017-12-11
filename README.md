# toogle [![Build Status][build]](https://circleci.com/gh/bcherny/toogle) [![npm]](https://www.npmjs.com/package/toogle) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/toogle.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/toogle.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/toogle.svg?style=flat-square

> Hoogle for TypeScript

## High level design

1. Accept a list of files. For each file =>
  a. Get list of reachable top-level nodes from TSC
  b. For each node =>
    i. Get type signature from TSC (including type params)
    ii. Return type [signature, source code, location] tuple
2. For each result tuple:
  a. Parse signature into abstract representation. Eg.:
      `"(number, number) => string"` -> ``


## Usage

### 1. Annotate your files

Add a JSDoc comment to any function you want Typedex to annotate for you. For example:

```js
/**
 * @typedex
 */
function add(a, b) {
  return a + b
}
```

You can also add optional annotations for parameter descriptions, examples, etc. For example:

```js
/**
 * Adds two numbers `a` and `b`.
 *
 * @typedex
 * @category Number
 * @param {number} a The first number to add.
 * @param {number} b The second number to add.
 * @returns {number} Returns the sum of the two numbers.
 * @see subtract, multiply, divide
 * @example
 *
 * let x = 1
 * let y = 2
 * let z = add(x, y)
 * // => 3
 */
function add(a, b) {
  return a + b
}
```

### 2. Index your code and generate a static Typedex site

TODO

### 3. Search!

In general, we aim to:

1. Begin returning results as early as possible, as the user types
2. Support a variety of signature syntaxes
3. Treat `this` types as 0th parameters

A user queries Toogle like so:

1. A user can search with a variety of signatures. Eg. to return the Array#find function, she might search for any of:
  - `A[], A => boolean`
  - `(A[], A => boolean) => A`
  - `(A[], A => boolean) => A | null`
  - `(f: (A => boolean)) => A | null`
  - `(a: A[], A => boolean) => A`
  - `A[] => A`
  - `T[] => T | null`
  - `number[] => number`
  - `Array<string> => string`

  Some of these queries represent syntactically correct TypeScript, while others are shorthand for quick, Hoogle-style lookups.
2. Results are returned in order of relevance to the input query. Factors that affect relevance:
  a. Concrete types match: if the user searches for a signature that contains the type `number` and there exists a signature containing the type `number`, then prefer that result over the equivalent polymorphic result
  b. Arities match: if the user searched for a function with 2 parameters, and there exists a signature with exactly 2 parameters, then prefer that result over equivalent results with non-matching arities
  c. Union type matches

## Query parsing spec

- `A`             `Generic('A')`
- `number`        `Simple('number')`
- `A[]`           `List(Generic('A'))`
- `-> A`          `Function0(Generic('A'))`
- `A -> B`        `Function1(Generic('A'), Generic('B'))`
- `A B -> B`      `Function2(Generic('A'), Generic('B'), Generic('B'))`
- `A, B -> B`     `Function2(Generic('A'), Generic('B'), Generic('B'))`
