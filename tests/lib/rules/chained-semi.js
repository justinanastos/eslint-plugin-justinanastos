/**
 * @fileoverview enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/chained-semi');
const RuleTester = require('eslint').RuleTester;

function wrongLineError(name) {
  return {
    message: `chained calls from '${name}' must have the semicolon on it's own line after all statements`,
  };
}

function wrongIndentError(name) {
  return {
    message: `chained calls from '${name}' must have a semicolon on it's own line at the same indent as the starting call`,
  };
}

function lineAboveError() {
  return {
    message: 'semicolon should not be on it\'s own line',
  };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run(
  'chained-semi',
  rule,
  {
    // eslint-disable-next-line justinanastos/alpha-object-expression
    valid: [
      'var obj = a.b();',
      `
      context.report({
        message: "semicolon should not be on it's own line",
        node: trailingSemiToken,
      });
    `,
      `
      var property = a.b[
        c.d.e() + 1
      ];
    `,
      `
      function fix(fixer) {
        return fixer.removeRange([
          sourceCode.getTokenBefore(trailingSemiToken, context).range[1],
          trailingSemiToken.range[0],
        ]);
      }
    `,
      {
        code: `
        context.report({
          fix,
          node,
          data: {
            name: findMemberExpressionName(node, context),
          },
          message: "chained calls from '{{name}}' must have the semicolon on it's own line after all statements",
        });
      `,
        parserOptions: { ecmaVersion: 6 },
      },
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
      {
        code: `
        var obj = a
          .b()
          .c()
          .d()
          ;
      `,
        errors: [
          wrongIndentError('a'),
        ],
        output: `
        var obj = a
          .b()
          .c()
          .d()
        ;
      `,
      },
      {
        code: `
        var obj = a
          .b
          .c();
      `,
        errors: [
          wrongLineError('a'),
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
          wrongIndentError('a'),
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
          wrongLineError('a'),
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
          wrongLineError('a'),
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
          wrongLineError('a'),
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
          wrongLineError('d'),
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
          wrongLineError('a'),
          wrongLineError('d'),
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
          wrongIndentError('a'),
          wrongLineError('d'),
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
        const commands = [{
          openSidebar() {
            this.waitForElementVisible('@menuButton')
              .api.pause(1000); // This delay is needed due to the animation in the sidebar menu.

            return this.click('@menuButton');
          },
        }];
      `,
        errors: [
          wrongLineError('this'),
        ],
        output: `
        const commands = [{
          openSidebar() {
            this.waitForElementVisible('@menuButton')
              .api.pause(1000)
            ; // This delay is needed due to the animation in the sidebar menu.

            return this.click('@menuButton');
          },
        }];
      `,
        parserOptions: { ecmaVersion: 6 },
      },
      {
        code: `
        context.report({
          fix,
          node,
          data: {
            name: findMemberExpressionName(node, context),
          },
          message: "chained calls from '{{name}}' must have the semicolon on it's own line after all statements",
        })
        ;
      `,
        errors: [
          lineAboveError(),
        ],
        output: `
        context.report({
          fix,
          node,
          data: {
            name: findMemberExpressionName(node, context),
          },
          message: "chained calls from '{{name}}' must have the semicolon on it's own line after all statements",
        });
      `,
        parserOptions: { ecmaVersion: 6 },
      },
    ],
  })
;
