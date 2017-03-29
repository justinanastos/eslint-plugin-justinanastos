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
  // eslint-disable-next-line justinanastos/alpha-object-expression
  valid: [
    {
      parserOptions,
      code: "import { a, b } from 'somewhere'",
    },
    {
      parserOptions,
      code: "import { a, B } from 'somewhere'",
      options: [{
        ignoreCase: true,
      }],
    },
    {
      parserOptions,
      code: "import { B, a } from 'somewhere';",
    },
    {
      parserOptions,
      code: `
        import { a, b } from 'somewhere'
        import React from 'react';
      `,
    },
  ],

  invalid: [
    {
      parserOptions,
      code: "import { b, a } from 'somewhere';",
      errors: ["Member 'a' of the import declaration should be sorted alphabetically."],
      output: "import { a, b } from 'somewhere';",
    },
    {
      parserOptions,
      code: "import { B, a } from 'somewhere';",
      errors: ["Member 'a' of the import declaration should be sorted alphabetically."],
      options: [{
        ignoreCase: true,
      }],
      output: "import { a, B } from 'somewhere';",
    },
    {
      parserOptions,
      code: "import React, { b, a } from 'somewhere'",
      errors: ["Member 'a' of the import declaration should be sorted alphabetically."],
      output: "import React, { a, b } from 'somewhere'",
    },
  ],
});
