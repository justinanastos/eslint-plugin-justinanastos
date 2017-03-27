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
    // {
    //   code: 'if (!a.length) {}',
    //   errors: ["'a.length' must use an explicit comparission, not a shortcut"],
    // },
    // {
    //   code: 'if (a === true) {}',
    //   errors: ["'a' must use a shortcut, not an explicit comparission to 'true'"],
    // },
    // {
    //   code: 'if (a === false) {}',
    //   errors: ["'a' must use a shortcut, not an explicit comparission to 'false'"],
    // },
    // {
    //   code: 'if (a !== false) {}',
    //   errors: ["'a' must use a shortcut, not an explicit comparission to 'false'"],
    // },
    // {
    //   code: 'if (a !== true) {}',
    //   errors: ["'a' must use a shortcut, not an explicit comparission to 'true'"],
    // },
  ],

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
});
