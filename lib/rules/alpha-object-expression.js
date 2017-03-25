/**
 * @fileoverview Rule to enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function allPropertyKeysCapitalized(node) {
  return node.properties.every((property) =>
        property.key.name && property.key.name.toUpperCase() === property.key.name
    );
}

function getKeyValue(property) {
  const key = property.key;
  let result;

  if (key.type === 'Identifier') {
    result = key.name;
  } else if (key.type === 'Literal') {
    result = key.value;
  }

  if (typeof result !== 'undefined') {
    return `${result}`.toLowerCase();
  }

  console.error("Don't know how to get key value for", key);
  throw new Error("Don't know how to get value");
}

function compareProperties(favorShorthand, a, b) {
  if (favorShorthand) {
    if (a.shorthand && !b.shorthand) {
      return 1;
    } else if (!a.shorthand && b.shorthand) {
      return -1;
    }
  }

  if (getKeyValue(a) === getKeyValue(b)) {
    return 0;
  } else if (getKeyValue(a) < getKeyValue(b)) {
    return 1;
  }

  return -1;
}

function parentIsReactCreateClass(node) {
  const parent = node.parent;
  const callee = parent.callee;

  return parent.type === 'CallExpression' &&
    callee.type === 'MemberExpression' &&
    callee.object.name === 'React' &&
    callee.property.name === 'createClass'
  ;
}

// const allowedNodeTypes = [
//   'ArrayExpression',
//   'BinaryExpression',
//   'CallExpression',
//   'ConditionalExpression',
//   'Identifier',
//   'JSXElement',
//   'Literal',
//   'LogicalExpression',
//   'MemberExpression',
//   'NewExpression',
//   'ObjectExpression',
//   'TemplateLiteral',
//   'UnaryExpression',
// ];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'enforce alphabetization of object expressions',
      recommended: false,
    },

    fixable: 'code',

    schema: [{
      additionalProperties: false,
      properties: {
        favorShorthand: {
          default: true,
          type: 'boolean',
        },
        ignoreAllCapitalized: {
          default: false,
          type: 'boolean',
        },
      },
      type: 'object',
    }],
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const rawOptions = context.options[0] || {};

    const options = {
      favorShorthand: typeof rawOptions.favorShorthand === 'boolean' ? rawOptions.favorShorthand : true,
      ignoreAllCapitalized: typeof rawOptions.ignoreAllCapitalized === 'boolean' ? rawOptions.ignoreAllCapitalized : false,
    };

    function ignoreNode(node) {
      const shouldCheck = node.properties.reduce(
        (accumulator, property) => {
          if (property.type === 'ExperimentalSpreadProperty' || property.type === 'ExperimentalRestProperty') {
            return false;
          } else if (property.key.type !== 'Identifier' && property.key.type !== 'Literal') {
            return false;
          } else if (parentIsReactCreateClass(node, sourceCode)) {
            return false;
          }
          // } else if (allowedNodeTypes.indexOf(property.value.type) === -1) {
          //   return false;
          // }

          return accumulator;
        },
        true
      );

      if (!shouldCheck) {
        return true;
      } else if (options.ignoreAllCapitalized && allPropertyKeysCapitalized(node)) {
        return true;
      }

      return false;
    }
    function testAlpha(node) {
      if (ignoreNode(node, options)) {
        return;
      }

      node.properties
        .slice(1)
        .forEach(
        (property) => {
          if (property.type === 'ExperimentalSpreadProperty') {
            return;
          }

          const ignoreProperty = property.key.type !== 'Identifier' && property.key.type !== 'Literal';

          // Don't start scanning until the second item
          if (ignoreProperty) {
            return;
          }

          const previousProperty = node.properties[
            node.properties.indexOf(property) - 1
          ];

          if (compareProperties(options.favorShorthand, property, previousProperty) > 0) {
            context.report({
              node: property,
              message: "'{{name}}' is not alphabetized",
              data: {
                name: property.key.name,
              },
              fix(fixer) {
                const delimiterLength = property.range[0] - previousProperty.range[1];
                const delimiter = sourceCode
                  .getText(
                    property,
                    delimiterLength
                  )
                  .substr(0, delimiterLength)
                ;

                return fixer.replaceTextRange(
                  [
                    previousProperty.start,
                    property.end,
                  ],
                  `${sourceCode.getText(property)}${delimiter}${sourceCode.getText(previousProperty)}`
                );
              },
            });
          }
        }
      );
    }

    return {
      'ObjectExpression:exit': testAlpha,
      'ObjectPattern:exit': testAlpha,
    };
  },
};
