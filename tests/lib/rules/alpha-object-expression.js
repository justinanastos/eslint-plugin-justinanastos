/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/alpha-object-expression');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('alpha-object-expression', rule, {

  invalid: [
    {
      code: 'var obj = { B: true, A: true }',
      errors: [
        '\'B\' and \'A\' are not alphabetized',
      ],
      output: 'var obj = { A: true, B: true }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: `
        var obj = {
          B: true,
          A: true
        }
      `,
      errors: [
        '\'B\' and \'A\' are not alphabetized',
      ],
      output: `
        var obj = {
          A: true,
          B: true
        }
      `,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: `
        var obj = {
          'B-1': true,
          'A-1': true
        }
      `,
      errors: [
        '\'B-1\' and \'A-1\' are not alphabetized',
      ],
      output: `
        var obj = {
          'A-1': true,
          'B-1': true
        }
      `,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b, a: true }',
      errors: [
        '\'b\' and \'a\' are not alphabetized',
      ],
      options: [{
        favorShorthand: false,
      }],
      output: 'var obj = { a: true, b }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b: true, A: true }',
      errors: [
        '\'b\' and \'A\' are not alphabetized',
      ],
      options: [{
        ignoreAllCapitalized: true,
      }],
      output: 'var obj = { A: true, b: true }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b: () => true, a: false }',
      errors: [
        '\'b\' and \'a\' are not alphabetized',
      ],
      output: 'var obj = { a: false, b: () => true }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b() {}, a: true }',
      errors: [
        '\'b\' and \'a\' are not alphabetized',
      ],
      output: 'var obj = { a: true, b() {} }',
      parserOptions: { ecmaVersion: 6 },
    },
  ],

  valid: [
    'var obj = { a: true, b: false }',
    {
      code: 'var obj = { b, a: true }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { a: true, b }',
      options: [{
        favorShorthand: false,
      }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { B: true, A: true }',
      options: [{
        ignoreAllCapitalized: true,
      }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'React.createClass({ d: true, a: true })',
    },
    {
      code: `
        import { Component } from 'React';

        class A extends Component {
          componentWillMount() {}
          componentDidMount() {}
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
});
