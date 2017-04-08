/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/import-destructuring-spacing');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Error messages
//------------------------------------------------------------------------------

function missingLineBreakError(first, second) {
  return `missing line break between '${first}' and '${second}'`;
}

function openingBracketError(text) {
  return `line break missing between opening bracket and '${text}'`;
}

function closingBracketError(text) {
  return `line break missing between '${text}' and closing bracket`;
}

function unncessaryLineBreakError() {
  return 'unncessary line breaks in import statement';
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = { ecmaVersion: 6, sourceType: 'module' };

const ruleTester = new RuleTester();
ruleTester.run(
  'import-destructuring-spacing',
  rule,
  {
   // eslint-disable-next-line justinanastos/alpha-object-expression
    valid: [
      {
        code: "import { a, b, c } from 'somewhere'",
        options: [3],
        parserOptions,
      },
      {
        code: "import { a, b, c } from 'somewhere'",
        options: [4],
        parserOptions,
      },
      {
        code: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
        options: [2],
        parserOptions,
      },
      {
        code: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
        options: [2],
        parserOptions,
      },
      {
        code: `
        import { a, b, c } from 'somewhere'
      `,
        options: ['multiline'],
        parserOptions,
      },
      {
        code: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
        options: ['multiline'],
        parserOptions,
      },
    ],

    invalid: [
      {
        code: `
        import { a, b, c } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
          missingLineBreakError('a', 'b'),
          missingLineBreakError('b', 'c'),
          closingBracketError('c'),
        ],
        options: [1],
        output: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
        parserOptions,
      },
      {
        code: `
        import {
          a,
          b
        } from 'somewhere'
      `,
        errors: [
          unncessaryLineBreakError(),
        ],
        options: [3],
        output: `
        import { a, b } from 'somewhere'
      `,
        parserOptions,
      },
      {
        code: `
        import { a, b, c } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
          missingLineBreakError('a', 'b'),
          missingLineBreakError('b', 'c'),
          closingBracketError('c'),
        ],
        options: [2],
        output: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
        parserOptions,
      },
      {
        code: `
        import {
          a, b, c } from 'somewhere'
      `,
        errors: [
          missingLineBreakError('a', 'b'),
          missingLineBreakError('b', 'c'),
          closingBracketError('c'),
        ],
        options: [2],
        output: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
        parserOptions,
      },
      {
        code: `
        import {
          a, b, c } from 'somewhere'
      `,
        errors: [
          unncessaryLineBreakError(),
        ],
        options: [3],
        output: `
        import { a, b, c } from 'somewhere'
      `,
        parserOptions,
      },
      {
        code: `
        import { a, b, c
        } from 'somewhere'
      `,
        errors: [
          unncessaryLineBreakError(),
        ],
        options: [3],
        output: `
        import { a, b, c } from 'somewhere'
      `,
        parserOptions,
      },
      {
        code: `
        import { a, b, c
        } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
          missingLineBreakError('a', 'b'),
          missingLineBreakError('b', 'c'),
        ],
        options: [2],
        parserOptions,
      },
      {
        code: `
        import {
          a, b,
          c
        } from 'somewhere'
      `,
        errors: [
          missingLineBreakError('a', 'b'),
        ],
        options: ['multiline'],
        parserOptions,
      },
      {
        code: `
        import {
          a, b, c
        } from 'somewhere'
      `,
        errors: [
          missingLineBreakError('a', 'b'),
          missingLineBreakError('b', 'c'),
        ],
        options: ['multiline'],
        parserOptions,
      },
      {
        code: `
        import {
          a,
          b,
          c } from 'somewhere'
      `,
        errors: [
          closingBracketError('c'),
        ],
        options: ['multiline'],
        parserOptions,
      },
      {
        code: `
        import { a,
          b,
          c
        } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
        ],
        options: ['multiline'],
        parserOptions,
      },
      {
        code: `
        import { a,
          b,
          c
        } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
        ],
        options: ['multiline'],
        parserOptions,
      },
      {
        code: `
        import {
          a,
          b,
          c } from 'somewhere'
      `,
        errors: [
          closingBracketError('c'),
        ],
        options: [2],
        parserOptions,
      },
      {
        code: `
        import { a,
          b,
          c
        } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
        ],
        options: [2],
        parserOptions,
      },
      {
        code: `
        import { a,
          b,
          c
        } from 'somewhere'
      `,
        errors: [
          openingBracketError('a'),
        ],
        options: [2],
        parserOptions,
      },
    ],
  })
;
