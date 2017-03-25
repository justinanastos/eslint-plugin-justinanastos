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

  invalid: [
    {
      code: 'var obj = { B: true, A: true }',
      errors: ["'A' is not alphabetized"],
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
      errors: ["'A' is not alphabetized"],
      output: `
        var obj = {
          A: true,
          B: true
        }
      `,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b, a: true }',
      errors: ["'a' is not alphabetized"],
      options: [{
        favorShorthand: false,
      }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b: true, A: true }',
      errors: ["'A' is not alphabetized"],
      options: [{
        ignoreAllCapitalized: true,
      }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b: () => true, c: true, a: false }',
      errors: ["'a' is not alphabetized"],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var obj = { b() {}, c: true, a: false }',
      errors: ["'a' is not alphabetized"],
      parserOptions: { ecmaVersion: 6 },
    },
  ],
});
