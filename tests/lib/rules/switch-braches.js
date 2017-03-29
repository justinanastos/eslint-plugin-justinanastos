/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/switch-braces');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('switch-braces', rule, {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  valid: [
    `
      switch (a) {
        case 1: {}
      }
    `,
    `
      switch (a) {
        case 1: {}
        default: {}
      }
    `,
  ],

  invalid: [
    {
      code: `
        switch (a) {
          case 1: break;
        }
      `,
      errors: ['switch cases must be surrounded with curly brackets'],
    },
    {
      code: `
        switch (a) {
          case 1: {break}
          default: break;
        }
      `,
      errors: ['switch cases must be surrounded with curly brackets'],
    },
    {
      code: `
        switch (a) {
          case 1: break;
          default: {break;}
        }
      `,
      errors: ['switch cases must be surrounded with curly brackets'],
    },
    {
      code: `
        switch (a) {
          case 1: break;
          default: break;
        }
      `,
      errors: [
        'switch cases must be surrounded with curly brackets',
        'switch cases must be surrounded with curly brackets',
      ],
    },
  ],
});
