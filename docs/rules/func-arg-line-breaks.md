# enforce line breaks in destructured `import`s (func-arg-line-breaks)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

# Rule Details

We want to enforce line breaks between all call expression arguments if any arguments are split by a line break. If any arguments are divided by line breaks, we also enforce a break after the opening paren `(` and the closing paren `)`.

# Options

This rule has no options.

# Examples

👎 Examples of **incorrect** code for this rule:

```js
// eslint func-arg-line-breaks: ["error"]
func(
  a, b
);
```

```js
// eslint func-arg-line-breaks: ["error"]
func(a,
  b
);
```

```js
// eslint func-arg-line-breaks: ["error"]
func(
  a,
  b);
```

```js
// eslint func-arg-line-breaks: ["error"]
func(
  a, b,
  c
);
```

```js
// eslint func-arg-line-breaks: ["error"]
func(
  a, b,
  c, d
);
```

```js
// eslint func-arg-line-breaks: ["error"]
func(
  a, b,
  c, d()
);
```

👍 Examples of **correct** code for this rule:

```js
// eslint func-arg-line-breaks: ["error"]
func(a, b);
```

```js
// eslint func-arg-line-breaks: ["error"]
func(
  a,
  b
);
```

## When Not To Use It

If you don't want to enforce line breaks in call expression arguments

## Resouces

- [Rule source](../../lib/rules/func-arg-line-breaks.js)
