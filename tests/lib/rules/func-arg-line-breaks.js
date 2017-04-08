/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/func-arg-line-breaks');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Error messages
//------------------------------------------------------------------------------

function breaksBetweenArgumentsError(type, line) {
  return {
    line,
    message: 'missing line between arguments',
    type,
  };
}

function openingParenError(line) {
  return {
    line,
    message: 'missing line after opening paren',
  };
}


function closingParenError(line) {
  return {
    line,
    message: 'missing line before closing paren',
  };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run(
  'func-arg-line-breaks',
  rule,
  {
  // eslint-disable-next-line justinanastos/alpha-object-expression
    valid: [
      {
        code: `
        func(a, b);
      `,
      },
      {
        code: `
        func(
          a,
          b
        );
      `,
      },
    ],

    invalid: [
      {
        code: `
        func(
          a, b
        );
      `,
        errors: [
          breaksBetweenArgumentsError('Identifier', 3),
        ],
        output: `
        func(
          a,
          b
        );
      `,
      },
      {
        code: `
        func(a,
          b
        );
      `,
        errors: [
          openingParenError(2),
        ],
        output: `
        func(
          a,
          b
        );
      `,
      },
      {
        code: `
        func(
          a,
          b);
      `,
        errors: [
          closingParenError(3),
        ],
        output: `
        func(
          a,
          b
        );
      `,
      },
      {
        code: `
        func(
          a, b,
          c
        );
      `,
        errors: [
          breaksBetweenArgumentsError('Identifier', 3),
        ],
        output: `
        func(
          a,
          b,
          c
        );
      `,
      },
      {
        code: `
        func(
          a, b,
          c, d
        );
      `,
        errors: [
          breaksBetweenArgumentsError('Identifier', 3),
          breaksBetweenArgumentsError('Identifier', 4),
        ],
        output: `
        func(
          a,
          b,
          c,
          d
        );
      `,
      },
      {
        code: `
        func(
          a, b,
          c, d()
        );
      `,
        errors: [
          breaksBetweenArgumentsError('Identifier', 3),
          breaksBetweenArgumentsError('CallExpression', 4),
        ],
        output: `
        func(
          a,
          b,
          c,
          d()
        );
      `,
      },
    ],
  })
;
