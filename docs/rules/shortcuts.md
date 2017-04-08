# enforce switch block bracing (shortcuts)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

# Rule Details

We want to enforce [AirBNB's Comparison Operators & Equality](https://github.com/airbnb/javascript#comparison--shortcuts):

>Use shortcuts for booleans, but explicit comparisons for strings and numbers.

This rule will enforce we don't explicitly compare to `true` or `false` and that we don't use a shortcut for `array.length`. Anything else is outside the scope of this rule.

# Examples

👎 Examples of **incorrect** code for this rule:

```js
// eslint shortcuts: ["error"]
if (a === true) {}
```

```js
// eslint shortcuts: ["error"]
if (a !== true) {}
```

```js
// eslint shortcuts: ["error"]
if (a === false) {}
```

```js
// eslint shortcuts: ["error"]
if (a !== false) {}
```

```js
// eslint shortcuts: ["error"]
if (array.length) {}
```

```js
// eslint shortcuts: ["error"]
if (!array.length) {}
```

👍 Examples of **correct** code for this rule:

```js
// eslint shortcuts: ["error"]
if (a) {}
```

```js
// eslint shortcuts: ["error"]
if (!a) {}
```

```js
// eslint shortcuts: ["error"]
if (array.length > 0) {}
```

```js
// eslint shortcuts: ["error"]
if (array.length === 0) {}
```

## When Not To Use It

If you don't want to enforce AirBNB shortcuts

## Resouces

- [Rule source](../../lib/rules/shortcuts.js)

