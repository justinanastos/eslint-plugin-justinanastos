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

  valid: [
    {
      code: "import { a , b, c, d, e, f, g, h } from 'somewhere'",
      parserOptions,
    },
    {
      code: "import { a, b, c, d } from 'somewhere'",
      options: [{
        collapse: true,
        minProperties: 5,
      }],
      parserOptions,
    },
    {
      code: "import { a, b } from 'somewhere'",
      options: [{
        collapse: true,
        minProperties: 3,
      }],
      parserOptions,
    },
    {
      code: `
        import {
          a,
          b,
          c
      } from 'somewhere'`,
      options: [{
        collapse: true,
        enforceIndentation: false,
        minProperties: 3,
      }],
      parserOptions,
    },
    {
      code: `
        import {
          a,
          b,
          c
      } from 'somewhere'`,
      options: [{
        enforceIndentation: false,
        minProperties: 3,
      }],
      parserOptions,
    },
    {
      code: "import {a, b} from 'somewhere'",
      parserOptions,
      options: [{
        enforceIndentation: false,
        minProperties: 3,
      }],
    },
    {
      code: `
        import type { FetchLayoutPageDiffActionCreator }
          // test
          from '../../../actions/layout-page-action/fetch-page-diff-action';
      `,
      parser: 'babel-eslint',
      parserOptions,
      options: [{
        enforceIndentation: false,
      }],
    },
    {
      code: `
        import type { FetchLayoutPageDiffActionCreator }
          from '../../../actions/layout-page-action/fetch-page-diff-action';
      `,
      parser: 'babel-eslint',
      parserOptions,
      options: [{
        enforceIndentation: false,
      }],
    },
    {
      code: "import type { FetchLayoutPageDiffActionCreator } from '../../../actions/layout-page-action/fetch-page-diff-action'",
      parser: 'babel-eslint',
      parserOptions,
      options: [{
        enforceIndentation: false,
      }],
    },
    {
      code: `
        import FetchLayoutPageDiffActionCreator
          from '../../../actions/layout-page-action/fetch-page-diff-action';
      `,
      parserOptions,
      options: [{
        enforceIndentation: false,
      }],
    },
  ],

  invalid: [
    {
      code: `
        import type { a }
          from 'somewhere';
      `,
      errors: [
        'line break missing between bracket and \'a\'',
        'line break missing between \'a\' and closing bracket',
      ],
      parser: 'babel-eslint',
      parserOptions,
      options: [{
        enforceIndentation: false,
        minProperties: 1,
      }],
    },
    {
      code: "import {a, b, c} from 'somewhere'",
      errors: [
        'line break missing between bracket and \'a\'',
        'missing line break between \'a\' and \'b\'',
        'missing line break between \'b\' and \'c\'',
        'line break missing between \'c\' and closing bracket',
      ],
      parserOptions,
      options: [{
        enforceIndentation: false,
        minProperties: 3,
      }],
    },
    {
      code: `
        import {a,
          b,
        c} from 'somewhere'
      `,
      errors: [
        'line break missing between bracket and \'a\'',
        'line break missing between \'c\' and closing bracket',
      ],
      parserOptions,
      options: [{
        enforceIndentation: false,
        minProperties: 3,
      }],
    },
    {
      code: "import { a, b, c, d, e, f, g, h } from 'somewhere'",
      errors: [
        'line break missing between bracket and \'a\'',
        'missing line break between \'a\' and \'b\'',
        'missing line break between \'b\' and \'c\'',
        'missing line break between \'c\' and \'d\'',
        'missing line break between \'d\' and \'e\'',
        'missing line break between \'e\' and \'f\'',
        'missing line break between \'f\' and \'g\'',
        'missing line break between \'g\' and \'h\'',
        'line break missing between \'h\' and closing bracket',
      ],
      parserOptions,
      options: [{
        minProperties: 3,
      }],
    },
    {
      code: `
        import {
          a, b, c, d, e, f, g, h
        } from 'somewhere'
      `,
      errors: [
        "missing line break between 'a' and 'b'",
        "missing line break between 'b' and 'c'",
        "missing line break between 'c' and 'd'",
        "missing line break between 'd' and 'e'",
        "missing line break between 'e' and 'f'",
        "missing line break between 'f' and 'g'",
        "missing line break between 'g' and 'h'",
      ],
      parserOptions,
      options: [{
        minProperties: 3,
        enforceIndentation: false,
      }],
    },
    {
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
        enforceIndentation: false,
        minProperties: 5,
      }],
      parserOptions,
    },
    {
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
        enforceIndentation: false,
        minProperties: 3,
        multiline: true,
      }],
      parserOptions,
    },
  ],
});
