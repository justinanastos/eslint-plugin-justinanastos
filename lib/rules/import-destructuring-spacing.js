/* eslint no-unused-vars: 'warn', no-empty: 'warn', no-unreachable: 'warn' */
/**
 * @fileoverview Rule to enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Normalizes a given option value.
 *
 * @param {string|Object|undefined} value - An option value to parse.
 * @returns {{indent: boolean, multiline: boolean, maxProperties: number}} Normalized option object.
 */
function normalizeOptionValue(value) {
  let collapse = true;
  let enforceIndentation = true;
  let indent = 2;
  let maxProperties;
  let multiline = false;

  if (value) {
    if (typeof value.collapse !== 'undefined') {
      collapse = Boolean(value.collapse);
    }

    if (typeof value.enforceIndentation !== 'undefined') {
      enforceIndentation = Boolean(value.enforceIndentation);
    }

    if (typeof value.indent !== 'undefined') {
      indent = parseInt(value.indent, 10);
    }

    if (typeof value.maxProperties !== 'undefined') {
      maxProperties = parseInt(value.maxProperties, 10);
    }

    if (typeof value.multiline !== 'undefined') {
      multiline = Boolean(value.multiline);
    }
  }

  return { collapse, enforceIndentation, indent, multiline, maxProperties };
}

function getSpecifiersExcludingDefault(node) {
  return node.specifiers.filter((specifier) => specifier.type === 'ImportSpecifier');
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
      filter: (token) => token.type === 'Punctuator' && token.value === '{',
    }
  );

  const closingBracket = sourceCode.getTokenAfter(
    specifiers[specifiers.length - 1],
    {
      filter: (token) => token.type === 'Punctuator' && token.value === '}',
    }
  );

  return openingBracket.loc.start.line !== closingBracket.loc.end.line;
}

function findWhitespaceBeforeNode(node, context) {
  const sourceCode = context.getSourceCode();
  const previousToken = sourceCode.getTokenBefore(node);
  const whitespaceLength = node.range[0] - previousToken.end;

  return sourceCode.getText(node, whitespaceLength).substr(0, whitespaceLength);
}

function findLocationOfWhitespaceAfterNode(node, context) {
  const sourceCode = context.getSourceCode();
  const nextToken = sourceCode.getTokenAfter(
    node,
    {
      filter: ({ value }) => value !== ',',
    }
  );

  return nextToken.start;
}
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      category: 'Whitespace',
      description: 'enforce line breaks for destructured imports',
      recommended: false,
    },

    fixable: 'whitespace',

    schema: [{
      additionalProperties: false,
      properties: {
        collapse: {
          type: 'boolean',
        },
        multiline: {
          type: 'boolean',
        },
        maxProperties: {
          minimum: 0,
          type: 'integer',
        },
        indent: {
          minimum: 0,
          type: 'integer',
        },
        enforceIndentation: {
          type: 'boolean',
        },
      },
      type: 'object',
    }],
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const options = normalizeOptionValue(context.options[0]);

    function enforceAddLineBreaks(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsLineBreaks = specifiers.length && (
        specifiers.length >= options.maxProperties ||
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
          const whitespace = findWhitespaceBeforeNode(property, context);

          if (whitespace.indexOf('\n') === -1) {
            context.report({
              node: property,
              message: 'missing line break between \'{{previous}}\' and \'{{current}}\'',
              data: {
                current: property.local.name,
                previous: previousProperty.local.name,
              },
              fix(fixer) {
                return fixer.replaceTextRange(
                  [
                    findLocationOfWhitespaceAfterNode(previousProperty, context),
                    property.start,
                  ],
                  '\n'
                );
              },
            });
          }
        })
      ;
    }

    function enforceCollapseLineBreaks(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsCollapseLineBreaks = (
        options.collapse &&
        specifiers.length &&
        specifiers.length < options.maxProperties &&
        sourceCode.getText(node).split('\n').length > 1
      );

      if (!needsCollapseLineBreaks) {
        return;
      }

      context.report({
        node,
        message: 'unncessary line breaks in import statement',
        fix(fixer) {
          return fixer.replaceTextRange(
            [
              node.range[0],
              node.range[1],
            ],
                        sourceCode.getText(node).replace(/\n/g, '')
                    );
        },
      });
    }

    function enforceIndentation(node) {
      if (!options.enforceIndentation) {
        return;
      }

      const specifiers = getSpecifiersExcludingDefault(node);

      const needsIndentation = hasSpecifiersIncludingLineBreaks(node, context);

      if (!needsIndentation) {
        return;
      }

      specifiers
        .forEach((property) => {
          const whitespace = findWhitespaceBeforeNode(property, context);

          if (whitespace.split('\n').pop().length !== options.indent) {
            context.report({
              node: property,
              message: 'incorrect indentation for \'{{name}}\'',
              data: {
                name: property.local.name,
              },
              fix(fixer) {
                const whiteSpaceExceptForThisLine = whitespace.replace(/[ ]+$/, '');

                return fixer.replaceTextRange(
                  [
                    property.range[0] - whitespace.length,
                    property.start,
                  ],
                  `${whiteSpaceExceptForThisLine}${' '.repeat(options.indent)}`
                );
              },
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
          specifiers.length >= options.maxProperties
        )
      ;

      if (!needsLeadingBracketLineBreak) {
        return;
      }

      const specifier = specifiers[0];

      const openingBracketToken = sourceCode.getTokenBefore(
        specifier,
        {
          filter: (token) => token.value === '{',
        }
      );

      if (specifier.loc.start.line === openingBracketToken.loc.start.line) {
        context.report({
          node: specifier.local,
          message: 'line break missing between bracket and \'{{name}}\'',
          data: {
            name: specifier.local.name,
          },
          fix(fixer) {
            return fixer.insertTextBefore(specifier, '\n');
          },
        });
      }
    }

    function enforceTrailingBracketLineBreak(node) {
      const specifiers = getSpecifiersExcludingDefault(node);

      const needsTrailingBracketLineBreak = hasSpecifiersIncludingLineBreaks(node, context) ||
        (
          specifiers.length &&
          specifiers.length >= options.maxProperties
        )
      ;

      if (!needsTrailingBracketLineBreak) {
        return;
      }

      const specifier = specifiers[specifiers.length - 1];
      const closingBracketToken = sourceCode.getTokenAfter(
        specifier,
        {
          filter: (token) => token.type === 'Punctuator' && token.value === '}',
        }
      );

      if (specifier.loc.start.line === closingBracketToken.loc.start.line) {
        context.report({
          node: specifier,
          message: 'line break missing between \'{{name}}\' and closing bracket',
          data: {
            name: specifier.local.name,
          },
          fix(fixer) {
            return fixer.insertTextBefore(
              closingBracketToken,
              '\n'
            );
          },
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
