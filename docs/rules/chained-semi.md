# enforce switch block bracing (chained-semi)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

# Rule Details

We like to enforce the rule that when you use chaining with line breaks, you put the final semicolon on a new line at the same indentation as the first line of the chain.

```js
var a = b
  .c()
  .d
  .e()
;
```

# Examples

👎 Examples of **incorrect** code for this rule:

```js
// eslint chained-semi: ["error"]
var a = b
  .c()
  .d
  .e();
```

```js
// eslint chained-semi: ["error"]
var a = b
  .c()
  .d
  .e()
  ;
```

👍 Examples of **correct** code for this rule:

```js
// eslint chained-semi: ["error"]
var a = b
  .c()
  .d
  .e()
;
```

```js
// eslint chained-semi: ["error"]
var a = b.c.d.e;
```

## When Not To Use It

If you don't want to enforce semicolon placement after chained statements.

## Resouces

- [Rule source](../../lib/rules/chained-semi.js)
- [`newline-per-chained-call`](http://eslint.org/docs/rules/newline-per-chained-call)

