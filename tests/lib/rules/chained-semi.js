/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/chained-semi');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('chained-semi', rule, {

  valid: [
    'var obj = something.something();',
    `
      var obj = something
        .something()
      ;
    `,
    `
      var obj = something
        .something()
        .something()
      ;
    `,
    `
      var obj = something
        .something
        .something()
      ;
    `,
    'something.something();',
    `
      something
        .something()
      ;
    `,
    {
      code: `
        const commands = [{
          openSidebar() {
            this.waitForElementVisible('@menuButton')
              .api.pause(1000); // This delay is needed due to the animation in the sidebar menu.

            return this.click('@menuButton');
          },
        }];
      `,
      parserOptions: { ecmaVersion: 6 },
    },
    `
      something
        .something
        .something()
      ;
    `,
    `
      a
        .b
        .c(function(d) {
          d.e();
        })
      ;
    `,
    `
      a
        .b
        .c(function(d) {
          return d
            .e()
          ;
        })
      ;
    `,
    `
      a
        .b
        .c(function(d) {
          return d
            .e(function(f) {
              return f.g();
            })
          ;
        })
      ;
    `,
    `
      a.b(function() {
      }).c;
    `,
    `
      a.b(function() {
      }).c.d;
    `,
    `
      a
        .b()
    `,
    `
      a(
        b
          .c()
      );
    `,
  ],

  invalid: [
    // {
    //   code: `
    //     var obj = a
    //       .b
    //       .c()
    //       ;
    //   `,
    //   errors: [
    //     'chained calls from \'a\' must have a semicolon on it\'s own line at the same indent as the starting call',
    //   ],
    //   output: `
    //     var obj = a
    //       .b
    //       .c()
    //     ;
    //   `,
    // },
    {
      code: `
        var obj = a
          .b
          .c();
      `,
      errors: [
        'chained calls from \'a\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        var obj = a
          .b
          .c()
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c()
          ;
      `,
      errors: [
        'chained calls from \'a\' must have a semicolon on it\'s own line at the same indent as the starting call',
      ],
      output: `
        a
          .b
          .c()
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c();
      `,
      errors: [
        'chained calls from \'a\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        a
          .b
          .c()
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c(function(d) {
            return d.e();
          });
      `,
      errors: [
        'chained calls from \'a\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        a
          .b
          .c(function(d) {
            return d.e();
          })
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c(function(d) {
            return d.e();
          });
      `,
      errors: [
        'chained calls from \'a\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        a
          .b
          .c(function(d) {
            return d.e();
          })
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c(function(d) {
            return d
              .e();
          })
        ;
      `,
      errors: [
        'chained calls from \'d\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        a
          .b
          .c(function(d) {
            return d
              .e()
            ;
          })
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c(function(d) {
            return d
              .e();
          });
      `,
      errors: [
        'chained calls from \'a\' must have the semicolon on it\'s own line after all statements',
        'chained calls from \'d\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        a
          .b
          .c(function(d) {
            return d
              .e()
            ;
          })
        ;
      `,
    },
    {
      code: `
        a
          .b
          .c(function(d) {
            return d
              .e();
          })
          ;
      `,
      errors: [
        'chained calls from \'a\' must have a semicolon on it\'s own line at the same indent as the starting call',
        'chained calls from \'d\' must have the semicolon on it\'s own line after all statements',
      ],
      output: `
        a
          .b
          .c(function(d) {
            return d
              .e()
            ;
          })
        ;
      `,
    },
  ],
});
