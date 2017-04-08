/* eslint-disable wyze/max-file-length */
const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/sort-imports');

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
};
const expectedError = {
  message: 'Imports should be sorted alphabetically.',
  type: 'ImportDeclaration',
};
const ignoreCaseArgs = [{ ignoreCase: true }];
const ignoreMemberSortArgs = [{ ignoreMemberSort: true }];

new RuleTester().run(
  'sort-imports',
  rule,
  {
    // eslint-disable-next-line justinanastos/alpha-object-expression
    valid: [
      {
        code:
        `
        import a from 'foo.js'
        import b from 'bar.js'
        import c from 'baz.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as B from 'foo.js'
        import A from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as B from 'foo.js'
        import { a, b } from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { b, c } from 'bar.js'
        import A from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import A from 'bar.js'
        import { b, c } from 'foo.js'
        `,
        options: [
          {
            memberSyntaxSortOrder: [
              'default', 'type', 'named', 'none', 'all',
            ],
          },
        ],
        parserOptions,
      },
      {
        code:
        `
        import { a, b } from 'bar.js'
        import { b, c } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import A from 'foo.js'
        import B from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import A from 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a, * as b from 'foo.js'
        import b from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import B from 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a from 'foo.js'
        import B from 'bar.js'
        `,
        options: ignoreCaseArgs,
        parserOptions,
      },
      {
        code:
        `
        import { a, b, c, d } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { b, A, C, d } from 'foo.js'
        `,
        options: ignoreMemberSortArgs,
        parserOptions,
      },
      {
        code:
        `
        import { B, a, C, d } from 'foo.js'
        `,
        options: ignoreMemberSortArgs,
        parserOptions,
      },
      {
        code:
        `
        import { a, B, c, D } from 'foo.js'
        `,
        options: ignoreCaseArgs,
        parserOptions,
      },
      {
        code:
        `
        import a, * as b from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as a from 'foo.js'

        import b from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as bar from 'bar.js'
        import * as foo from 'foo.js'
        `,
        parserOptions,
      },
      // https://github.com/eslint/eslint/issues/5130
      {
        code:
        `
        import 'foo'
        import bar from 'bar'
        `,
        options: ignoreCaseArgs,
        parserOptions,
      },
      // https://github.com/eslint/eslint/issues/5305
      {
        code:
        `
        import React, { Component } from 'react'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { bar } from 'bar.js'
        import foo from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import type { A } from 'a'
        import * as B from 'b'
        `,
        parser: 'babel-eslint',
        parserOptions,
      },
    ],
    invalid: [
      {
        code:
        `
        import a from 'foo.js'
        import A from 'bar.js'
        `,
        errors: [expectedError],
        output:
        `
        import A from 'bar.js'
        import a from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a from 'foo.js'

        import A from 'bar.js'
        `,
        errors: [expectedError],
        output:
        `
        import A from 'bar.js'

        import a from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import b from 'foo.js'
        import a from 'bar.js'
        `,
        errors: [expectedError],
        output:
        `
        import a from 'bar.js'
        import b from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { b, c } from 'foo.js'
        import { a, b } from 'bar.js'
        `,
        errors: [expectedError],
        output:
        `
        import { a, b } from 'bar.js'
        import { b, c } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as foo from 'foo.js'
        import * as bar from 'bar.js'
        `,
        errors: [expectedError],
        output:
        `
        import * as bar from 'bar.js'
        import * as foo from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a from 'foo.js'
        import { b, c } from 'bar.js'
        `,
        errors: [
          {
            message: "Expected 'named' syntax before 'default' syntax.",
            type: 'ImportDeclaration',
          },
        ],
        output:
        `
        import { b, c } from 'bar.js'
        import a from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a from 'foo.js'
        import * as b from 'bar.js'
        `,
        errors: [
          {
            message: "Expected 'all' syntax before 'default' syntax.",
            type: 'ImportDeclaration',
          },
        ],
        output:
        `
        import * as b from 'bar.js'
        import a from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a from 'foo.js'
        import 'bar.js'
        `,
        errors: [
          {
            message: "Expected 'none' syntax before 'default' syntax.",
            type: 'ImportDeclaration',
          },
        ],
        output:
        `
        import 'bar.js'
        import a from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import b from 'bar.js'
        import * as a from 'foo.js'
        `,
        errors: [
          {
            message: "Expected 'all' syntax before 'default' syntax.",
            type: 'ImportDeclaration',
          },
        ],
        options: [
          {
            memberSyntaxSortOrder: [
              'all', 'type', 'default', 'named', 'none',
            ],
          },
        ],
        output:
        `
        import * as a from 'foo.js'
        import b from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { b, a, d, c } from 'foo.js'
        `,
        errors: [
          {
            message: "Member 'a' of the import declaration should be sorted" +
              ' alphabetically.',
            type: 'ImportSpecifier',
          },
          {
            message: "Member 'c' of the import declaration should be sorted" +
              ' alphabetically.',
            type: 'ImportSpecifier',
          },
        ],
        output:
        `
        import { a, b, c, d } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { a, B, c, D } from 'foo.js'
        `,
        errors: [
          {
            message: "Member 'B' of the import declaration should be sorted" +
              ' alphabetically.',
            type: 'ImportSpecifier',
          },
          {
            message: "Member 'D' of the import declaration should be sorted" +
              ' alphabetically.',
            type: 'ImportSpecifier',
          },
        ],
        output:
        `
        import { B, a, D, c } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import B from 'b'
        import type { C } from 'c'
        `,
        errors: [
          {
            message: "Expected 'type' syntax before 'default' syntax.",
            type: 'ImportDeclaration',
          },
        ],
        output:
        `
        import type { C } from 'c'
        import B from 'b'
        `,
        parser: 'babel-eslint',
        parserOptions,
      },
    ],
  }
);
