# enforce line breaks in destructured `import`s (import-destructuring-spacing)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

# Rule Details

We want clear rules on how destructured import specifiers are broken up by lines.

# Options

This rule has a mixed option:

For example, to enforce [multiline](#multiline) behavior (default):

```js
{
    "indent": ["error", "multiline", 2]
}
```

or use the default:

```js
{
    "indent": ["error"]
}
```

---

Or to enforce a [specifier limit](#specifier-limit):

```js
{
    "indent": ["error", 3, 2]
}
```

## Indentation

Both options support a second options argument to determine how many spaces of indentation to use. This is necessary because as of eslint 3, `indent` will not enforce indentation of `import` statements.

## Multiline

Using multiline enforcement means that you have two options:

- Use line breaks between _no_ specifiers
- Use line breaks between _all_ specifiers

👎 Examples of **incorrect** code for this rule with the `"multiline", 2` option:

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { 
  a, b, 
  c
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { 
    a, b, 
    c
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { a, b, c
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { 
  a, b, c } from 'somewhere';
```

👍 Examples of **correct** code for this rule with the `"multiline"` option:

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { a, b, c } from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { a, b, c } 
  from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { 
  a, 
  b, 
  c 
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", "multiline", 2]
import { 
  a, 
  b, 
  c 
} 
  from 'somewhere';
```

## Specifier Limit

Using a specifier limit means that for this number or greater specifier, you must use separate lines for all of them. If you have less than this many, you must put them on a single line.


👎 Examples of **incorrect** code for this rule with the `3, 2` option (specifier limit of `3` with indentation of `2` spaces):

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { a, b, c } from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { 
  a, 
  b
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { 
    a, 
    b, 
    c 
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { a, b, c, d } from 'somewhere';
```

👍 Examples of **correct** code for this rule with the `3, 2` option (specifier limit of `3` with indentation of `2` spaces):

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { a, b } from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { a, b } 
  from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { 
  a, 
  b, 
  c 
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { 
  a, 
  b, 
  c 
} 
  from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { 
  a, 
  b, 
  c,
  d
} from 'somewhere';
```

```js
// eslint import-destructuring-spacing: ["error", 3, 2]
import { 
  a, 
  b, 
  c,
  d
} 
  from 'somewhere';
```

## When Not To Use It

If you don't want to enforce line breaks in import speecifiers

## Resouces

- [Rule source](../../lib/rules/import-destructuring-spacing.js)
