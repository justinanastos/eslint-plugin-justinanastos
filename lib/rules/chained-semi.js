/**
 * @fileoverview Enforce chained calls have a trailing semicolon on a newline in the same column
 * as the start.
 * @author Justin Anastos <justin.anastos@gmail.com>
 */


const getFirstTokenOnLine = require('../common/get-first-token-on-line');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function findMemberExpressionName(node, context) {
  const sourceCode = context.getSourceCode()
  ;
  const token = sourceCode.getFirstToken(node)
  ;

  return token.value;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  meta: {
    docs: {
      category: 'Whitespace',
      description: 'enforce semicolon position after chaining',
      recommended: false,
    },

    fixable: 'whitespace',

    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode()
    ;

    function testSemi(node) {
      if (!node.callee || node.callee.type !== 'MemberExpression') {
        return;
      }

      const callee = node.callee;
      let parent = callee.object;

      while (parent && parent.callee) {
        parent = parent.callee.object;
      }

      if (node.loc.start.line === node.loc.end.line) {
        return;
      }

      const trailingSemiToken = sourceCode.getTokenAfter(node);

      if (!(trailingSemiToken && trailingSemiToken.value === ';')) {
        return;
      }

      const firstTokenOnSemiLine = getFirstTokenOnLine(trailingSemiToken, context);
      if (firstTokenOnSemiLine.loc.start.column ===
        getFirstTokenOnLine(node, context).loc.start.column) {
        if (firstTokenOnSemiLine !== trailingSemiToken) {
          return;
        }

        // The first token on the line is a seicolon. This is only ok if the
        // previous line starts on a different column than node.

        const firstTokenOnLineAboveSemi = getFirstTokenOnLine(
          sourceCode.getTokenBefore(trailingSemiToken),
          context
        );

        if (firstTokenOnLineAboveSemi.loc.start.column === node.loc.start.column) {
          context.report({
            fix(fixer) {
              return fixer.removeRange([
                sourceCode.getTokenBefore(trailingSemiToken, context).range[1],
                trailingSemiToken.range[0],
              ]);
            },
            message: 'semicolon should not be on it\'s own line',
            node: trailingSemiToken,
          });

          return;
        }
      }

      const tokenBeforeSemi = sourceCode.getTokenBefore(trailingSemiToken);

      function fix(fixer) {
        const column = getFirstTokenOnLine(node, context).loc.start.column;
        const whitespace = `\n${' '.repeat(column)}`;
        const previousToken = sourceCode.getTokenBefore(trailingSemiToken)
        ;

        return fixer.replaceTextRange(
          [
            previousToken.range[1],
            trailingSemiToken.range[0],
          ],
          whitespace
        );
      }

      if (trailingSemiToken.loc.start.line === tokenBeforeSemi.loc.start.line) {
        context.report({
          fix,
          node,
          data: {
            name: findMemberExpressionName(node, context),
          },
          message: "chained calls from '{{name}}' must have the semicolon on it's own line after all statements",
        });
      } else if (getFirstTokenOnLine(node, context).loc.start.column !==
          trailingSemiToken.loc.start.column) {
        context.report({
          fix,
          node,
          data: {
            name: findMemberExpressionName(node, context),
          },
          message: "chained calls from '{{name}}' must have a semicolon on it's own line at the same indent as the starting call",
        });
      }
    }

    return {
      'CallExpression:exit': testSemi,
    };
  },
};
