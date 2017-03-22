# enforce switch block bracing (switch-braces)

🔧 The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

# Rule Details

We want to enforce that `switch` statement `case` and `default` blocks are surrounded by brackets `{}`.

# Examples

👎 Examples of **incorrect** code for this rule:

```js
// eslint switch-braces: ["error"]
switch(a) {
    case 1: break;
}
```

```js
// eslint switch-braces: ["error"]
switch(a) {
    case 1: {break;}
    default: break;
}
```

```js
// eslint switch-braces: ["error"]
switch(a) {
    case 1: break;
    default: {break;}
}
```

```js
// eslint switch-braces: ["error"]
switch(a) {
    case 1: break;
    default: break;
}
```

👍 Examples of **correct** code for this rule:

```js
// eslint switch-braces: ["error"]
switch(a) {
    case 1: {
        break;
    }
}
```

```js
// eslint switch-braces: ["error"]
switch(a) {
    case 1: {
        break;
    }
    default: {
        break;
    }
}
```

## When Not To Use It

If you don't want to enforce braces around `case` or `default` code blocks.

## Resouces

- [Rule source](../../lib/rules/switch-braces.js)

