/**
 * @fileoverview descc
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const rules = requireIndex(`${__dirname}/rules`);

// import all rules in lib/rules
module.exports.rules = rules;

// Add recommended config
module.exports.configs = {
  recommended: {
    rules: {
      'justinanastos/alpha-object-expression': 'warn',
      'justinanastos/chained-semi': 'warn',
      'justinanastos/import-destructuring-spacing': [
        'warn',
        {
          collapse: true,
          maxProperties: 3,
        },
      ],
      'justinanastos/sort-imports': [
        'warn',
        {
          ignoreCase: true,
        },
      ],
      'justinanastos/switch-braces': 'off',
    },
  },
};
