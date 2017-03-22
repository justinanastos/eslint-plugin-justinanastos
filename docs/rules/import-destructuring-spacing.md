# enforce line breaks in destructured `import`s (import-destructuring-spacing)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

# Rule Details

We want clear rules on how destructured import specifiers are broken up by lines.

# Options

This rule has an object option:

- `collapse: true` (default) enforces specifiers are not split by line breaks if they are less than `minProperties` specifiers.

- `minProperties`

    If there more than or equal to this many specifiers, then they must be broken up.

    If `collapse` is `true`, enforces that specifiers are not separated by line breaks if there are less than this many.

- `multiline: true` (default) enforce if any specifiers are separated by line breaks, they all should be.

- `indent: 2` (default) use this many spaces to indent.

    This is here because import specifiers are not enforced by [`indent`](http://eslint.org/docs/rules/key-spacing).

- `enforceIndentation: true` (default) enforce indentiation has this many spaces on specifiers on their own line.

    This is here because import specifiers are not enforced by [`indent`](http://eslint.org/docs/rules/key-spacing).

## `minProperties`

👎 Examples of **incorrect** code for this rule with the `{ minProperties: 3 }` option:

```js
// eslint import-destructuring-spacing: ["error", { minProperties: 3 }]
import {a, b, c} from 'somewhere';
```

👍 Examples of **correct** code for this rule with the `{ minProperties: 3 }` option:

```js
// eslint import-destructuring-spacing: ["error", { minProperties: 3 }]
import {
    a,
    b,
    c
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", { minProperties: 3 }]
import {a, b} from 'somewhere';
```

## `collapse: true` and `minProperties`

👎 Examples of **incorrect** code for this rule with the `{ "collapse": true, minProperties: 3 }` option:

```js
// eslint import-destructuring-spacing: ["error", { "collapse": true, minProperties: 3 }]
import {
    a,
    b,
    c
} from 'somewhere';
```

👍 Examples of **correct** code for this rule with the `{ "collapse": true, minProperties: 3 }` option:

```js
// eslint import-destructuring-spacing: ["error", { "collapse": true, minProperties: 3 }]
import {
    a,
    b,
    c
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", { "collapse": true, minProperties: 3 }]
import {a, b} from 'somewhere';
```

## `multiline`

👎 Examples of **incorrect** code for this rule with the default `{ "multiline": true }` option:

```js
// eslint import-destructuring-spacing: ["error", { "multiline": true }]
import {
    a, b,
    c
} from 'somewhere';

👍 Examples of **correct** code for this rule with the default `{ "favorShorthand": true }` option:

```js
// eslint import-destructuring-spacing: ["error", { "favorShorthand": true }]
import {a, b, c} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", { "favorShorthand": true }]
import {
    a,
    b,
    c
} from 'somewhere';
```

## When Not To Use It

If you don't want to enforce line breaks in import speecifiers

## Resouces

- [Rule source](../../lib/rules/import-destructuring-spacing.js)
