/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/sort-imports');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = { ecmaVersion: 6, sourceType: 'module' };

const ruleTester = new RuleTester();
ruleTester.run('sort-imports', rule, {

  valid: [
    {
      code: "import { a, b } from 'somewhere'",
      parserOptions,
    },
    {
      code: "import { a, B } from 'somewhere'",
      parserOptions,
      options: [{
        ignoreCase: true,
      }],
    },
    {
      code: "import { B, a } from 'somewhere';",
      parserOptions,
    },
    {
      code: `
        import { a, b } from 'somewhere'
        import React from 'react';
      `,
      parserOptions,
    },
  ],

  invalid: [
    {
      code: "import { b, a } from 'somewhere';",
      errors: ["Member 'a' of the import declaration should be sorted alphabetically."],
      parserOptions,
    },
    {
      code: "import { B, a } from 'somewhere';",
      errors: ["Member 'a' of the import declaration should be sorted alphabetically."],
      parserOptions,
      options: [{
        ignoreCase: true,
      }],
    },
    {
      code: "import React, { b, a } from 'somewhere'",
      parserOptions,
      errors: ["Member 'a' of the import declaration should be sorted alphabetically."],
    },
  ],
});