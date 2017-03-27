/**
 * @fileoverview Rule to enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function allPropertyKeysCapitalized(node) {
  return node.properties.every(property =>
        property.key.name && property.key.name.toUpperCase() === property.key.name
    );
}

function getKeyValue(property, ignoreCase = true) {
  const key = property.key;
  let result;

  if (key.type === 'Identifier') {
    result = key.name;
  } else if (key.type === 'Literal') {
    result = key.value;
  }

  if (typeof result !== 'undefined') {
    if (ignoreCase) {
      result = `${result}`.toLowerCase();
    }

    return result;
  }

  throw new Error(`Don't know how to get value for '${key}'`);
}

function arePropertiesSorted(favorShorthand, a, b) {
  if (favorShorthand) {
    if (a.shorthand && !b.shorthand) {
      return true;
    } else if (!a.shorthand && b.shorthand) {
      return false;
    }
  }

  if (getKeyValue(a) === getKeyValue(b)) {
    return true;
  }

  return getKeyValue(a) < getKeyValue(b);
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
  // eslint-disable-next-line justinanastos/alpha-object-expression
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
        .slice(0, -1)
        .forEach(
        (previousProperty) => {
          const property = node.properties[
            node.properties.indexOf(previousProperty) + 1
          ]
          ;

          if (property.type === 'ExperimentalSpreadProperty') {
            return;
          }

          const ignoreProperty = property.key.type !== 'Identifier' && property.key.type !== 'Literal';

          // Don't start scanning until the second item
          if (ignoreProperty) {
            return;
          }

          if (!arePropertiesSorted(options.favorShorthand, previousProperty, property)) {
            context.report({
              data: {
                first: getKeyValue(previousProperty, false),
                second: getKeyValue(property, false),
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
              message: "'{{first}}' and '{{second}}' are not alphabetized",
              node: previousProperty,
            });
          }
        }
      )
      ;
    }

    return {
      'ObjectExpression:exit': testAlpha,
      'ObjectPattern:exit': testAlpha,
    };
  },

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
};
