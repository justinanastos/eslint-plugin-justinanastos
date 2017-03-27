# eslint-plugin-justinanastos

[![Build Status][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![devDependencies][depsdev-image]][depsdev-url]

> My personal [ESLint](//github.com/eslint/eslint) rules.

## Installation

There is a `peerDependencies` on `eslint@^3.16`.

```shell
$ npm i --save-dev eslint-plugin-wyze eslint
```

## Usage

### package.json

```js
{
  // ...
  "eslintConfig": {
    "plugins": [
      "justinanastos"
    ]
  }
}
```

### .eslintrc

```js
{
  "plugins": [
    "justinanastos"
  ]
}
```

## Supported Rules

* [alpha-object-expression](./docs/rules/alpha-object-expression.md): Enforce alphabetized object expressions. _(🔧 fixable)_
* [chained-semi](./docs/rules/chained-semi.md): Enforce semicolon spacing on chained calls. _(🔧 fixable)_
* [import-destructuring-spacing](./docs/rules/import-destructuring-spacing.md): Enforce whitespace in destructured import statements. _(🔧 fixable)_
* [shortcuts](./docs/rules/shortcuts.md): Enforce [airbnb's Comparison Operators & Equality > Shortcuts](https://github.com/airbnb/javascript#comparison--shortcuts). _(🔧 fixable)_
* [switch-braches](./docs/rules/switch-braches.md): Enforce braces around switch statements. _(🔧 fixable)_


## Recommended Config

We support a recommended config for the rules.

### Enable

```js
{
  "extends": "plugin:justinanastos/recommended",
  "plugins": [
    "justinanastos"
  ]
}
```
## License

MIT © [Justin Anastos](https://justinanastos.github.io)

[travis-image]: https://img.shields.io/travis/justinanastos/eslint-plugin-justinanastos.svg?style=flat-square
[travis-url]: https://travis-ci.org/justinanastos/eslint-plugin-justinanastos

[npm-image]: https://img.shields.io/npm/v/eslint-plugin-wyze.svg?style=flat-square
[npm-url]: https://npmjs.com/package/eslint-plugin-wyze

[depsdev-image]: https://img.shields.io/david/dev/justinanastos/eslint-plugin-justinanastos.svg?style=flat-square
[depsdev-url]: https://david-dm.org/justinanastos/eslint-plugin-justinanastos?type=dev
