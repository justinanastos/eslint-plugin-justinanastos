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
 * @returns {{indent: boolean, multiline: boolean, minProperties: number}} Normalized option object.
 */
function normalizeOptionValue(value) {
  let collapse = true;
  let enforceIndentation = true;
  let indent = 2;
  let minProperties;
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

    if (typeof value.minProperties !== 'undefined') {
      minProperties = parseInt(value.minProperties, 10);
    }

    if (typeof value.multiline !== 'undefined') {
      multiline = Boolean(value.multiline);
    }
  }

  return { collapse, enforceIndentation, indent, multiline, minProperties };
}

function specifiersIncludeLineBreaks(node, context) {
  return context.getSourceCode().getText(node).split('\n').length > 1;
}

function getSpecifiers(node) {
  return node.specifiers.filter((specifier) => specifier.type === 'ImportSpecifier');
}

function findWhitespaceBeforeNode(node, context) {
  const sourceCode = context.getSourceCode();

  for (let i = 1; i < 100; i += 1) {
    const text = sourceCode.getText(node, i).substr(0, i);

    if (text.trim().length !== 0) {
      return sourceCode.getText(node, i - 1).substr(0, i - 1);
    }
  }

  throw new Error('could not find whitepsace boundary');
}

function findLocationOfWhitespaceAfterNode(node, context) {
  const sourceCode = context.getSourceCode();
  const nodeLength = sourceCode.getText(node).length;

  for (let i = 1; i < 100; i += 1) {
    const text = sourceCode.getText(node, 0, i).substr(nodeLength, i);

    if (text.trim().length !== text.length) {
      return node.range[1] + i;
    }
  }

  throw new Error('could not find whitepsace boundary');
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

    fixable: 'code',

    schema: [{
      additionalProperties: false,
      minProperties: 1,
      properties: {
        collapse: {
          type: 'boolean',
        },
        multiline: {
          type: 'boolean',
        },
        minProperties: {
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
      const specifiers = getSpecifiers(node);

      const needsLineBreaks = (
        specifiers.length >= options.minProperties ||
        (
          options.multiline &&
          specifiersIncludeLineBreaks(node, context)
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
      const specifiers = getSpecifiers(node);

      const needsCollapseLineBreaks = (
                options.collapse &&
                specifiers.length < options.minProperties &&
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

      const specifiers = getSpecifiers(node);

      const needsIndentation = specifiersIncludeLineBreaks(node, context);

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
      try {
        const specifiers = getSpecifiers(node);

        const needsLeadingBracketLineBreak = specifiersIncludeLineBreaks(node, context);

        if (!needsLeadingBracketLineBreak) {
          return;
        }

        const specifier = specifiers[0];

        for (let i = 1; i < 100; i += 1) {
          const textPreceeding = sourceCode.getText(specifier, i);

          if (textPreceeding.indexOf('{') !== -1 && textPreceeding.indexOf('\n') === -1) {
            context.report({
              node: specifier,
              message: 'line break missing between bracket and \'{{name}}\'',
              data: {
                name: specifier.local.name,
              },
              fix(fixer) {
                return fixer.insertTextBefore(specifier, '\n');
              },
            });

            break;
          }
        }
      } catch (error) {
        console.error('Error in', context.getFilename());
        throw error;
      }
    }

    function enforceTrailingBracketLineBreak(node) {
      try {
        const specifiers = getSpecifiers(node);

        const needsTrailingBracketLineBreak = specifiersIncludeLineBreaks(node, context);

        if (!needsTrailingBracketLineBreak) {
          return;
        }

        const specifier = specifiers[specifiers.length - 1];
        const specifierNameLength = specifier.local.name.length;

        for (let i = 1; i < 100; i += 1) {
          const textFollowing = sourceCode
                      .getText(specifier, 0, i)
                      .substr(specifierNameLength)
                  ;

          if (textFollowing.indexOf('}') !== -1) {
                      // We've found the closing bracket

                      // Verify there's a line break in there
            if (textFollowing.indexOf('\n') === -1) {
              context.report({
                node: specifier,
                message: 'line break missing between \'{{name}}\' and closing bracket',
                data: {
                  name: specifier.local.name,
                },
                fix(fixer) {
                  return fixer.insertTextAfterRange(
                    [
                      specifier.range[0],
                      (specifier.range[1] + textFollowing.length) - 1,
                    ],
                                      '\n'
                                  );
                },
              });
            }

            break;
          }
        }
      } catch (error) {
        console.error('Error in', context.getFilename());
        throw error;
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
