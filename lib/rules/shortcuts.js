/**
 * @fileoverview Rule to flag use of destructured props
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getLeftName(node) {
  if (node.type === 'Identifier') {
    return node.name;
  } else if (node.type === 'MemberExpression') {
    let iterator = node;
    const pieces = [];

    while (iterator.object) {
      pieces.unshift(iterator.property.name);
      iterator = iterator.object;
    }

    pieces.unshift(iterator.name);

    return pieces.join('.');
  }

  return node.type;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow the use of destructuring props',
      category: 'Variables',
      recommended: false,
    },

    fixable: 'code',

    schema: {},
  },

  create(context) {
    function testBoolean(node) {
      if (node.right.type === 'Literal' && typeof node.right.value === 'boolean') {
        if (node.left.type === 'Identifier' || node.left.type === 'MemberExpression') {
          context.report({
            node,
            message: "'{{name}}' must use a shortcut, not an explicit comparission to '{{value}}'",
            data: {
              name: getLeftName(node.left),
              value: node.right.value,
            },
            fix(fixer) {
              if (node.right.value) {
                return fixer
                  .replaceTextRange([
                    node.left.range[1],
                    node.right.range[1],
                  ], '')
                ;
              }

              return fixer.replaceTextRange(
                [
                  node.left.range[0],
                  node.right.range[1],
                ],
                `!${getLeftName(node.left)}`
              );
            },
          });
        } else if (node.right.value) {
          context.report({
            node,
            message: "'{{name}}' must use a shortcut, not an explicit comparission to '{{value}}'",
            data: {
              name: getLeftName(node.left),
              value: node.right.value,
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [
                  node.left.range[1],
                  node.right.range[1],
                ],
                ''
              );
            },
          });
        } else {
          context.report({
            node,
            message: "'{{name}}' must use a shortcut, not an explicit comparission to '{{value}}'",
            data: {
              name: getLeftName(node.left),
              value: node.right.value,
            },
          });
        }
      }
    }

    function testLength(node) {
      if (node.property.name !== 'length') {
        return;
      }

      if (node.parent.type === 'UnaryExpression' && node.parent.operator === '!') {
        context.report({
          node,
          message: "'{{left}}.{{right}}' must use an explicit comparission, not a shortcut",
          data: {
            left: node.object.name,
            right: node.property.name,
          },
          fix(fixer) {
            return fixer
              .replaceTextRange(node.parent.range, `${node.object.name}.${node.property.name}===0`)
            ;
          },
        });
      } else if (node.parent.type !== 'BinaryExpression') {
        context.report({
          node,
          message: "'{{left}}.{{right}}' must use an explicit comparission, not a shortcut",
          data: {
            left: node.object.name,
            right: node.property.name,
          },
          fix(fixer) {
            return fixer.insertTextAfter(node, '>0');
          },
        });
      }
    }

    return {
      'MemberExpression:exit': testLength,
      'BinaryExpression:exit': testBoolean,
    };
  },
};
