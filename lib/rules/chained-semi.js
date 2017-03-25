/**
 * @fileoverview Enforce chained calls have a trailing semicolon on a newline in the same column
 * as the start.
 * @author Justin Anastos <justin.anastos@gmail.com>
 */

const getFirstTokenOnLine = require('../common/get-first-token-on-line');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isChildOfMemberExpression(node) {
  let parent = node.parent;

  while (parent) {
    if (parent.type === 'MemberExpression') {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

function findMemberExpressionName(node, context) {
  const sourceCode = context.getSourceCode();
  const token = sourceCode.getFirstToken(node);

  return token.value;
}

function isNodeMultilineChaining(node, context) {
  const sourceCode = context.getSourceCode();

  try {
    const previousToken = sourceCode.getTokenBefore(
      node.property,
      {
        filter: (token) => token.value !== '.',
      }
    );

    return node.property.loc.start.line !== previousToken.loc.start.line;
  } catch (error) {
    console.error(context.getFilename());
    console.error(sourceCode.getText(node));
    console.error(error);
    process.exit(1);
  }
}

function hasTrailingSemi(node, context) {
  const sourceCode = context.getSourceCode();
  const tokenAfter = sourceCode.getTokenAfter(node);

  return tokenAfter && tokenAfter.value === ';';
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
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
    const sourceCode = context.getSourceCode();

    function testSemi(node) {
      const needsSemiTest = node.type === 'MemberExpression' &&
        node.loc.start.line !== node.loc.end.line
        && !isChildOfMemberExpression(node)
        && isNodeMultilineChaining(node, context)
        && hasTrailingSemi(node.parent, context)
      ;

      if (!needsSemiTest) {
        return;
      }

      // Use `node.parent` to find the trailing semi because the member expression is a child of
      // something else like an `ExpressionStatement`, `VariableDeclarator`, or `CallExpression`.
      // That is the node we care about. This will prevent us from grabbing semis inside of
      // `CallExpression` in the `MemberExpression`.
      const semiToken = sourceCode.getTokenAfter(
        node.parent,
        {
          filter: (token) => token.value === ';',
        }
      );

      function fix(fixer) {
        const column = getFirstTokenOnLine(node, context).loc.start.column;
        const whitespace = `\n${' '.repeat(column)}`;
        const previousToken = sourceCode.getTokenBefore(semiToken);

        return fixer.replaceTextRange(
          [
            previousToken.range[1],
            semiToken.range[0],
          ],
          whitespace
        );
      }

      if (node.parent.loc.end.line === semiToken.loc.start.line) {
        context.report({
          node,
          message: "chained calls from '{{name}}' must have the semicolon on it's own line after all statements",
          data: {
            name: findMemberExpressionName(node, context),
          },
          fix
        });

        return;
      }

      if (getFirstTokenOnLine(node, context).loc.start.column !== semiToken.loc.start.column) {
        context.report({
          node,
          message: "chained calls from '{{name}}' must have a semicolon on it's own line at the same indent as the starting call",
          data: {
            name: findMemberExpressionName(node, context),
          },
          fix
        });
      }
    }

    return {
      'MemberExpression:exit': testSemi,
    };
  },
};
