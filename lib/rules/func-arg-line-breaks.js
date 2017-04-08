/**
 * @fileoverview Rule to enforce line breaks between all call expression arguments if any arguments
 *               are split by a line break
 * @author Justin Anastos
 */

//------------------------------------------------------------------------------
// Dependencies
//------------------------------------------------------------------------------

const getLeadingWhitespaceLength = require('../common/get-leading-whitespace-length');
const getTextBetweenNodesOrTokens = require('../common/get-text-between-nodes-or-tokens');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'enforce line breaks between all call expression arguments if any arguments are split by a line break',
      recommended: false,
    },

    fixable: 'whitespace',

    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function testBreaksBetweenArguments(node) {
      if (
        node.arguments.length <= 1 ||
        node.loc.start.line === node.loc.end.line
      ) {
        return;
      }

      node
        .arguments
        .slice(1)
        .forEach((argument) => {
          const previousArgument = node.arguments[
            node.arguments.indexOf(argument) - 1
          ];

          if (previousArgument.loc.start.line === argument.loc.start.line) {
            context.report({
              fix: fixer => fixer.replaceTextRange(
                [
                  previousArgument.range[1],
                  argument.range[0],
                ],
                `${getTextBetweenNodesOrTokens(context, previousArgument, argument).trim()}\n${' '.repeat(2 + getLeadingWhitespaceLength(context, node))}`
              ),
              message: 'missing line between arguments',
              node: argument,
            });
          }
        }
      );
    }

    function testBreaksBeforeArguments(node) {
      if (
        node.arguments.length <= 1 ||
        node.loc.start.line === node.loc.end.line ||
        node.loc.start.line !== node.arguments[0].loc.start.line
      ) {
        return;
      }

      context.report({
        fix(fixer) {
          const argument = node.arguments[0];
          const openingParen = sourceCode.getTokenBefore(
            argument,
            { filter: token => token.type === 'Punctuator' && token.value === '(' }
          );

          return fixer.replaceTextRange(
            [
              openingParen.range[1],
              argument.range[0],
            ],
            `${getTextBetweenNodesOrTokens(context, openingParen, argument).trim()}\n${' '.repeat(2 + getLeadingWhitespaceLength(context, node))}`
          );
        },
        message: 'missing line after opening paren',
        node: node.arguments[0],
      });
    }

    function testBreaksAfterArguments(node) {
      if (
        node.arguments.length <= 1 ||
        node.loc.start.line === node.loc.end.line ||
        node.loc.end.line !== node.arguments[node.arguments.length - 1].loc.start.line
      ) {
        return;
      }

      context.report({
        fix(fixer) {
          const argument = node.arguments[node.arguments.length - 1];
          const closingParen = sourceCode.getTokenAfter(
            argument,
            { filter: token => token.type === 'Punctuator' && token.value === ')' }
          );

          return fixer.replaceTextRange(
            [
              argument.range[1],
              closingParen.range[0],
            ],
            `${getTextBetweenNodesOrTokens(context, argument, closingParen).trim()}\n${' '.repeat(getLeadingWhitespaceLength(context, node))}`
          );
        },
        message: 'missing line before closing paren',
        node: node.arguments[0],
      });
    }

    return {
      'CallExpression:exit': (node) => {
        testBreaksBeforeArguments(node);
        testBreaksBetweenArguments(node);
        testBreaksAfterArguments(node);
      },
    };
  },
};
