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
      'justinanastos/alpha-object-expression': ['warn', { favorShorthand: true }],
      'justinanastos/chained-semi': 'warn',
      'justinanastos/func-arg-line-breaks': 'warn',
      'justinanastos/import-destructuring-spacing': [
        'warn',
        'multiline',
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
