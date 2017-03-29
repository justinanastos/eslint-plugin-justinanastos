/**
 * @fileoverview Rule to enforce alphabetization of object expressions
 * @author Justin Anastos
 */


const getFirstTokenOnLine = require('../common/get-first-token-on-line');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function needsCollapseLineBreaks(node, context) {
  const specifiers = getSpecifiersExcludingDefault(node);
  const options = normalizeOptions(context.options);

  return options.collapse &&
    specifiers.length &&
    specifiers.length <= options.maxProperties &&
    hasSpecifiersIncludingLineBreaks(node, context)
  ;
}

/**
 * Normalizes a given option value.
 *
 * @param {string|Object|undefined} value - An option value to parse.
 * @returns {{indent: boolean, multiline: boolean, maxProperties: number}} Normalized option object.
 */
function normalizeOptions(options) {
  const DEFAULT_INDENT = 2;

  let collapse;
  let indent;
  let maxProperties;
  let multiline;

  let value;
  if (options.length === 0) {
    collapse = false;
    indent = DEFAULT_INDENT;
    multiline = true;
  } else {
    value = options[0];

    if (value === 'multiline') {
      collapse = false;
      maxProperties = undefined;
      multiline = true;
    } else {
      collapse = true;
      multiline = false;
      maxProperties = parseInt(value, 10);
    }

    indent = typeof options[1] === 'undefined' ? DEFAULT_INDENT : parseInt(options[1], 10);
  }

  return { collapse, indent, maxProperties, multiline };
}

function getPreceedingImportToken(nodeOrToken, context) {
  const sourceCode = context.getSourceCode();

  return sourceCode.getTokenBefore(
    nodeOrToken,
    { filter: token => token.type === 'Keyword' && token.value === 'import' }
  );
}

function getSpecifiersExcludingDefault(node) {
  return node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier');
}

function hasSpecifiersIncludingLineBreaks(node, context) {
  const specifiers = getSpecifiersExcludingDefault(node);

  if (specifiers.length === 0) {
    return false;
  }

  const sourceCode = context.getSourceCode();

  const openingBracket = sourceCode.getTokenBefore(
    specifiers[0],
    {
      filter: token => token.type === 'Punctuator' && token.value === '{',
    }
  );

  const closingBracket = sourceCode.getTokenAfter(
    specifiers[specifiers.length - 1],
    {
      filter: token => token.type === 'Punctuator' && token.value === '}',
    }
  );

  return openingBracket.loc.start.line !== closingBracket.loc.end.line;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  meta: {
    docs: {
      category: 'Whitespace',
      description: 'enforce line breaks for destructured imports',
      recommended: false,
    },

    fixable: 'whitespace',

    schema: [{
      additionalProperties: false,
      oneOf: [
        {
          enum: ['multiline'],
        },
        {
          minimum: 0,
          type: 'integer',
        },
      ],
    }, {
      minimum: 0,
      type: 'integer',
    }],
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const options = normalizeOptions(context.options);

    function enforceAddLineBreaks(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsLineBreaks = specifiers.length && (
        specifiers.length > options.maxProperties ||
        (
          options.multiline &&
          hasSpecifiersIncludingLineBreaks(node, context)
        )
      );

      if (!needsLineBreaks) {
        return;
      }

      specifiers
        .slice(1)
        .forEach((property) => {
          const previousProperty = specifiers[specifiers.indexOf(property) - 1];

          if (property.loc.end.line === previousProperty.loc.start.line) {
            context.report({
              data: {
                current: property.local.name,
                previous: previousProperty.local.name,
              },
              fix(fixer) {
                const importToken = getPreceedingImportToken(property, context);
                const preceedingToken = sourceCode.getTokenBefore(property);
                const leadingWhitespace = ' '.repeat(importToken.loc.start.column + options.indent);

                return fixer.replaceTextRange(
                  [
                    preceedingToken.range[1],
                    property.range[0],
                  ],
                  `\n${leadingWhitespace}`
                );
              },
              message: 'missing line break between \'{{previous}}\' and \'{{current}}\'',
              node: property,
            });
          }
        })
      ;
    }

    function enforceCollapseLineBreaks(node) {
      if (!needsCollapseLineBreaks(node, context)) {
        return;
      }

      const closingBracketToken = sourceCode
        .getTokens(node)
        .find(token => token.type === 'Punctuator' && token.value === '}')
      ;

      const textBeforeClosingBracket = sourceCode.getText(node)
        .substr(0, closingBracketToken.end - node.start)
      ;

      context.report({
        node,
        fix(fixer) {
          return fixer.replaceTextRange(
            [
              node.range[0],
              closingBracketToken.end,
            ],
            textBeforeClosingBracket.replace(/\s+/g, ' ')
          );
        },
        message: 'unncessary line breaks in import statement',
      });
    }

    function enforceIndentation(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsIndentation = hasSpecifiersIncludingLineBreaks(node, context);

      if (!needsIndentation) {
        return;
      }

      specifiers
        .forEach((property) => {
          const preceedingImportToken = getPreceedingImportToken(property, context);
          const firstTokenOnLine = getFirstTokenOnLine(property, context);
          const expectedIndentation = preceedingImportToken.loc.start.column + options.indent;

          if (property.loc.start.column !== firstTokenOnLine.loc.start.column) {
            // This is not the first token on this line, don't check indentation.
            return;
          }

          if (firstTokenOnLine.loc.start.column !== expectedIndentation) {
            context.report({
              data: {
                name: property.local.name,
              },
              fix(fixer) {
                const tokenBefore = sourceCode.getTokenBefore(property);

                return fixer.replaceTextRange(
                  [
                    tokenBefore.range[1],
                    property.range[0],
                  ],
                  `\n${' '.repeat(expectedIndentation)}`
                );
              },
              message: 'incorrect indentation for \'{{name}}\'',
              node: property,
            });
          }
        })
      ;
    }

    function enforceLeadingBracketLineBreak(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsLeadingBracketLineBreak = hasSpecifiersIncludingLineBreaks(node, context) ||
        (
          specifiers.length &&
          specifiers.length > options.maxProperties
        )
      ;

      if (!needsLeadingBracketLineBreak || needsCollapseLineBreaks(node, context)) {
        return;
      }

      const specifier = specifiers[0];

      const openingBracketToken = sourceCode.getTokenBefore(
        specifier,
        {
          filter: token => token.value === '{',
        }
      );

      if (specifier.loc.start.line === openingBracketToken.loc.start.line) {
        context.report({
          data: {
            name: specifier.local.name,
          },
          fix(fixer) {
            const tokenBefore = sourceCode.getTokenBefore(specifier);
            const firstTokenOnLine = getFirstTokenOnLine(tokenBefore, context);
            const leadingWhitespace = ' '.repeat(
              options.indent + firstTokenOnLine.loc.start.column
            );

            return fixer.replaceTextRange(
              [
                tokenBefore.range[1],
                specifier.range[0],
              ],
              `\n${leadingWhitespace}`
            );
          },
          message: 'line break missing between opening bracket and \'{{name}}\'',
          node: specifier.local,
        });
      }
    }

    function enforceTrailingBracketLineBreak(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsTrailingBracketLineBreak = hasSpecifiersIncludingLineBreaks(node, context) ||
        (
          specifiers.length &&
          specifiers.length > options.maxProperties
        )
      ;

      if (!needsTrailingBracketLineBreak || needsCollapseLineBreaks(node, context)) {
        return;
      }

      const specifier = specifiers[specifiers.length - 1];
      const closingBracketToken = sourceCode.getTokenAfter(
        specifier,
        {
          filter: token => token.type === 'Punctuator' && token.value === '}',
        }
      );

      if (specifier.loc.start.line === closingBracketToken.loc.start.line) {
        context.report({
          data: {
            name: specifier.local.name,
          },
          fix(fixer) {
            const importToken = getPreceedingImportToken(specifier, context);
            const leadingWhitespace = ' '.repeat(importToken.loc.start.column);
            const fromToken = sourceCode.getTokenAfter(
              specifier,
              { filter: token => token.type === 'Identifier' && token.value === 'from' }
            );

            return fixer.replaceTextRange(
              [
                sourceCode.getTokenBefore(closingBracketToken).range[1],
                fromToken.range[0],
              ],
              `\n${leadingWhitespace}} `
            );
          },
          message: 'line break missing between \'{{name}}\' and closing bracket',
          node: specifier,
        });
      }
    }

    return {
      'ImportDeclaration:exit': (node) => {
        enforceAddLineBreaks(node);
        enforceCollapseLineBreaks(node);
        enforceLeadingBracketLineBreak(node);
        enforceTrailingBracketLineBreak(node);
        enforceIndentation(node);
      },
    };
  },
};
