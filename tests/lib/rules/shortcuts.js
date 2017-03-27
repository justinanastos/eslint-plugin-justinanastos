/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/shortcuts');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('shortcuts', rule, {

  invalid: [
    {
      code: 'if (a.length) {}',
      errors: ["'a.length' must use an explicit comparission, not a shortcut"],
    },
    {
      code: 'if (!a.length) {}',
      errors: ["'a.length' must use an explicit comparission, not a shortcut"],
    },
    {
      code: 'if (a === true) {}',
      errors: ["'a' must use a shortcut, not an explicit comparission to 'true'"],
    },
    {
      code: 'if (a === false) {}',
      errors: ["'a' must use a shortcut, not an explicit comparission to 'false'"],
    },
    {
      code: 'if (a !== false) {}',
      errors: ["'a' must use a shortcut, not an explicit comparission to 'false'"],
    },
    {
      code: 'if (a !== true) {}',
      errors: ["'a' must use a shortcut, not an explicit comparission to 'true'"],
    },
  ],

  valid: [
    'if (a.length === 0) {}',
    'if (a.length === 1) {}',
    'if (a.length > 0) {}',
    'if (a) {}',
    'if (!a) {}',
    'if (a === "") {}',
    'if (a === 0) {}',
    'if (a !== 0) {}',
    'if (a > 3) {}',
  ],
});
