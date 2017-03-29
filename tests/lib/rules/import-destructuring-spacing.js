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
// Tests
//------------------------------------------------------------------------------

const parserOptions = { ecmaVersion: 6, sourceType: 'module' };

const ruleTester = new RuleTester();
ruleTester.run('import-destructuring-spacing', rule, {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  valid: [
    {
      parserOptions,
      code: "import { a , b, c, d, e, f, g, h } from 'somewhere'",
    },
    {
      parserOptions,
      code: "import { a, b, c, d } from 'somewhere'",
      options: [{
        collapse: true,
        maxProperties: 5,
      }],
    },
    {
      parserOptions,
      code: "import { a, b } from 'somewhere'",
      options: [{
        collapse: true,
        maxProperties: 3,
      }],
    },
    {
      parserOptions,
      code: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
      options: [{
        collapse: true,
        maxProperties: 3,
      }],
    },
    {
      parserOptions,
      code: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
      options: [{
        maxProperties: 3,
      }],
    },
    {
      parserOptions,
      code: "import {a, b} from 'somewhere'",
      options: [{
        maxProperties: 3,
      }],
    },
    {
      parserOptions,
      code: `
        import type { FetchLayoutPageDiffActionCreator }
          // test
          from '../../../actions/layout-page-action/fetch-page-diff-action';
      `,
      parser: 'babel-eslint',
    },
    {
      parserOptions,
      code: `
        import type { FetchLayoutPageDiffActionCreator }
          from '../../../actions/layout-page-action/fetch-page-diff-action';
      `,
      parser: 'babel-eslint',
    },
    {
      parserOptions,
      code: "import type { FetchLayoutPageDiffActionCreator } from '../../../actions/layout-page-action/fetch-page-diff-action'",
      parser: 'babel-eslint',
    },
    {
      parserOptions,
      code: `
        import FetchLayoutPageDiffActionCreator
          from '../../../actions/layout-page-action/fetch-page-diff-action';
      `,
    },
  ],

  invalid: [
    {
      parserOptions,
      code: `
        import type { a }
          from 'somewhere';
      `,
      errors: [
        'line break missing between opening bracket and \'a\'',
        'line break missing between \'a\' and closing bracket',
      ],
      options: [{
        enforceIndentation: false,
        maxProperties: 1,
      }],
      output: `
        import type {
          a
        } from 'somewhere';
      `,
      parser: 'babel-eslint',
    },
    {
      parserOptions,
      code: `
        import {a, b, c} from 'somewhere'
      `,
      errors: [
        'line break missing between opening bracket and \'a\'',
        'missing line break between \'a\' and \'b\'',
        'missing line break between \'b\' and \'c\'',
        'line break missing between \'c\' and closing bracket',
      ],
      options: [{
        enforceIndentation: false,
        maxProperties: 3,
      }],
      output: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import {a,
          b,
        c} from 'somewhere'
      `,
      errors: [
        'line break missing between opening bracket and \'a\'',
        'line break missing between \'c\' and closing bracket',
        'incorrect indentation for \'c\'',
      ],
      options: [{
        maxProperties: 3,
      }],
      output: `
        import {
          a,
          b,
          c
        } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import {a,
          b,
        c,} from 'somewhere'
      `,
      errors: [
        'line break missing between opening bracket and \'a\'',
        'line break missing between \'c\' and closing bracket',
        'incorrect indentation for \'c\'',
      ],
      options: [{
        maxProperties: 3,
      }],
      output: `
        import {
          a,
          b,
          c,
        } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import { a, b, c, d, e, f, g, h } from 'somewhere'
      `,
      errors: [
        'line break missing between opening bracket and \'a\'',
        'missing line break between \'a\' and \'b\'',
        'missing line break between \'b\' and \'c\'',
        'missing line break between \'c\' and \'d\'',
        'missing line break between \'d\' and \'e\'',
        'missing line break between \'e\' and \'f\'',
        'missing line break between \'f\' and \'g\'',
        'missing line break between \'g\' and \'h\'',
        'line break missing between \'h\' and closing bracket',
      ],
      options: [{
        maxProperties: 3,
      }],
      output: `
        import {
          a,
          b,
          c,
          d,
          e,
          f,
          g,
          h
        } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import {
          a, b
        } from 'somewhere'
      `,
      errors: [
        'missing line break between \'a\' and \'b\'',
      ],
      options: [{
        collapse: true,
        maxProperties: 1,
      }],
      output: `
        import {
          a,
          b
        } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import {
          a,
          b,
          c,
          d
        } from 'somewhere'
      `,
      errors: [
        'unncessary line breaks in import statement',
      ],
      options: [{
        collapse: true,
        maxProperties: 5,
      }],
      output: `
        import { a, b, c, d } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import {
          a,
          b,
          c,
          d,
        } from 'somewhere'
      `,
      errors: [
        'unncessary line breaks in import statement',
      ],
      options: [{
        collapse: true,
        maxProperties: 5,
      }],
      output: `
        import { a, b, c, d, } from 'somewhere'
      `,
    },
    {
      parserOptions,
      code: `
        import {
          a, b,
          c, d,
        } from 'somewhere'
      `,
      errors: [
        "missing line break between 'a' and 'b'",
        "missing line break between 'c' and 'd'",
      ],
      options: [{
        collapse: false,
        maxProperties: 3,
        multiline: true,
      }],
      output: `
        import {
          a,
          b,
          c,
          d,
        } from 'somewhere'
      `,
    },
  ],
});
