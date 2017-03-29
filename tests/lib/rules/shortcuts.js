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
// Helpers
//------------------------------------------------------------------------------

function explicitLengthComparisonError(name) {
  return `'${name}.length' must use an explicit comparison, not a shortcut`;
}

function shortcutError(name, result) {
  return `'${name}' must use a shortcut, not an explicit comparison to '${result}'`;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('shortcuts', rule, {

  invalid: [
    {
      code: 'if (a.length) {}',
      errors: [
        explicitLengthComparisonError('a'),
      ],
      output: 'if (a.length>0) {}',
    },
    {
      code: 'if (!a.length) {}',
      errors: [
        explicitLengthComparisonError('a'),
      ],
      output: 'if (a.length===0) {}',
    },
    {
      code: 'if (a === true) {}',
      errors: [
        shortcutError('a', true),
      ],
      output: 'if (a) {}',
    },
    {
      code: 'if (a == true) {}',
      errors: [
        shortcutError('a', true),
      ],
      output: 'if (a) {}',
    },
    {
      code: 'if (a === false) {}',
      errors: [
        shortcutError('a', false),
      ],
      output: 'if (!a) {}',
    },
    {
      code: 'if (a == false) {}',
      errors: [
        shortcutError('a', false),
      ],
      output: 'if (!a) {}',
    },
    {
      code: 'if (a !== false) {}',
      errors: [
        shortcutError('a', false),
      ],
      output: 'if (a) {}',
    },
    {
      code: 'if (a != false) {}',
      errors: [
        shortcutError('a', false),
      ],
      output: 'if (a) {}',
    },
    {
      code: 'if (a !== true) {}',
      errors: [
        shortcutError('a', true),
      ],
      output: 'if (!a) {}',
    },
    {
      code: 'if (a != true) {}',
      errors: [
        shortcutError('a', true),
      ],
      output: 'if (!a) {}',
    },
  ],

  valid: [
    'if (a.length == 0) {}',
    'if (a.length === 0) {}',
    'if (a.length == 1) {}',
    'if (a.length === 1) {}',
    'if (a.length > 0) {}',
    'if (a) {}',
    'if (!a) {}',
    'if (a == "") {}',
    'if (a === "") {}',
    'if (a == 0) {}',
    'if (a === 0) {}',
    'if (a != 0) {}',
    'if (a !== 0) {}',
    'if (a > 3) {}',
    'if (a < 3) {}',
  ],
});
