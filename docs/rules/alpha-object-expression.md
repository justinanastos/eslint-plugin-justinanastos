# enforce alphabetization of object expressions (alpha-object-expression)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

If a line is more than 10 lines away from where it should be, you'll have to run this rule with `--fix` more than once because of an [eslint limitation](http://eslint.org/docs/developer-guide/working-with-rules#applying-fixes).

# Rule Details

We want object expressions to always be alphabetized.

# Options

This rule has an object option:

- `favorShorthand: true` (default) enforces shorthand properties be grouped at the top of an object declaration per the [Airbnb JavaScript Style Guide > Objects](https://github.com/airbnb/javascript#objects--grouped-shorthand).
- `ignoreAllCapitalized: false` (default) ignores objects that have keys that are **all** capitalized, such as an enumeration.

## `favorShorthand`

👎 Examples of **incorrect** code for this rule with the default `{ "favorShorthand": true }` option:

```js
// eslint alpha-object-expression: ["error", { "favorShorthand": true }]
var x = 1;
var obj = {
    a: 2,
    x,
}
```

👍 Examples of **correct** code for this rule with the default `{ "favorShorthand": true }` option:

```js
// eslint alpha-object-expression: ["error", { "favorShorthand": true }]
var x = 1;
var obj = {
    x,
    a: 2,
}
```

👍 Examples of **correct** code for this rule with the `{ "favorShorthand": false }` option:

```js
// eslint alpha-object-expression: ["error", { "favorShorthand": false }]
var x = 1;
var obj = {
    a: 2,
    x,
}
```

```js
// eslint alpha-object-expression: ["error", { "favorShorthand": false }]
var x = 1;
var obj = {
    x,
    a: 2,
}
```

## `ignoreAllCapitalized`

👎 Examples of **incorrect** code for this rule with the default `{ "ignoreAllCapitalized": false }` option:

```js
// eslint alpha-object-expression: ["error", { "ignoreAllCapitalized": false }]
var myEnum = {
    YES: 'yes',
    NO: 'no'
}
```

👍 Examples of **correct** code for this rule with the default `{ "ignoreAllCapitalized": false }` option:

```js
// eslint alpha-object-expression: ["error", { "ignoreAllCapitalized": false }]
var myEnum = {
    NO: 'no'
    YES: 'yes',
}
```

```js
// eslint alpha-object-expression: ["error", { "ignoreAllCapitalized": false }]
var myEnum = {
    b: true,
    NO: 'no'
    YES: 'yes',
}
```

👎 Examples of **incorrect** code for this rule with the `{ "ignoreAllCapitalized": true }` option:

```js
// eslint alpha-object-expression: ["error", { "ignoreAllCapitalized": true }]
var myEnum = {
    cat: true,
    YES: 'yes',
    NO: 'no'
}
```

👍 Examples of **correct** code for this rule with the `{ "ignoreAllCapitalized": true }` option:

```js
// eslint alpha-object-expression: ["error", { "ignoreAllCapitalized": true }]
var myEnum = {
    YES: 'yes',
    NO: 'no'
}
```

```js
// eslint alpha-object-expression: ["error", { "ignoreAllCapitalized": true }]
var myEnum = {
    NO: 'no'
    YES: 'yes',
}
```

## When Not To Use It

If you don't care about the order of lines in your object expressions

## Resouces

- [Rule source](../../lib/rules/alpha-object-expression.js)

