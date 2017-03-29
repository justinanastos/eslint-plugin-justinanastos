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
  // eslint-disable-next-line justinanastos/alpha-object-expression
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
    'if (a.length>0 && !b) {}',
    'if (a.length===0 && !b) {}',
    'if (a.length===0 && b) {}',
    'if (a.length>0 && !b) {}',
    'if (a instanceof HTMLElement) {}',
    'if (!(a instanceof HTMLElement)) {}',
  ],

  invalid: [
    {
      code: 'if (a.length) {}',
      errors: [
        explicitLengthComparisonError('a'),
      ],
      output: 'if (a.length>0) {}',
    },
    {
      code: 'if (a.length && b === false) {}',
      errors: [
        explicitLengthComparisonError('a'),
        shortcutError('b', false),
      ],
      output: 'if (a.length>0 && !b) {}',
    },
    {
      code: 'if (!a.length && b === true) {}',
      errors: [
        explicitLengthComparisonError('a'),
        shortcutError('b', true),
      ],
      output: 'if (a.length===0 && b) {}',
    },
    {
      code: 'if (a.length && b === true) {}',
      errors: [
        explicitLengthComparisonError('a'),
        shortcutError('b', true),
      ],
      output: 'if (a.length>0 && b) {}',
    },
    {
      code: 'if (get(a, "b").length) {}',
      errors: [
        explicitLengthComparisonError('get(a, "b")'),
      ],
      output: 'if (get(a, "b").length>0) {}',
    },
    {
      code: 'if (!get(a, "b").length) {}',
      errors: [
        explicitLengthComparisonError('get(a, "b")'),
      ],
      output: 'if (get(a, "b").length===0) {}',
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
    {
      code: 'if (get(a, "b") === true) {}',
      errors: [
        shortcutError('get(a, "b")', true),
      ],
      output: 'if (get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") == true) {}',
      errors: [
        shortcutError('get(a, "b")', true),
      ],
      output: 'if (get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") !== true) {}',
      errors: [
        shortcutError('get(a, "b")', true),
      ],
      output: 'if (!get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") != true) {}',
      errors: [
        shortcutError('get(a, "b")', true),
      ],
      output: 'if (!get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") === false) {}',
      errors: [
        shortcutError('get(a, "b")', false),
      ],
      output: 'if (!get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") == false) {}',
      errors: [
        shortcutError('get(a, "b")', false),
      ],
      output: 'if (!get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") !== false) {}',
      errors: [
        shortcutError('get(a, "b")', false),
      ],
      output: 'if (get(a, "b")) {}',
    },
    {
      code: 'if (get(a, "b") != false) {}',
      errors: [
        shortcutError('get(a, "b")', false),
      ],
      output: 'if (get(a, "b")) {}',
    },
    {
      code: 'if (a instanceof HTMLElement === true) {}',
      errors: [
        shortcutError('a instanceof HTMLElement', true),
      ],
      output: 'if (a instanceof HTMLElement) {}',
    },
    {
      code: 'if (a instanceof HTMLElement === false) {}',
      errors: [
        shortcutError('a instanceof HTMLElement', false),
      ],
      output: 'if (!(a instanceof HTMLElement)) {}',
    },
    {
      code: 'if ((a instanceof HTMLElement) === true) {}',
      errors: [
        shortcutError('a instanceof HTMLElement', true),
      ],
      output: 'if (a instanceof HTMLElement) {}',
    },
    {
      code: 'if ((a instanceof HTMLElement) === false) {}',
      errors: [
        shortcutError('a instanceof HTMLElement', false),
      ],
      output: 'if (!(a instanceof HTMLElement)) {}',
    },
  ],
});
