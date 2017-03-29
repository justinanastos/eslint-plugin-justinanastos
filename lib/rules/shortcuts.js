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
  // eslint-disable-next-line justinanastos/alpha-object-expression
  create(context) {
    const sourceCode = context.getSourceCode();

    function testBoolean(node) {
      console.log(context.getSourceCode().getText(node));

      if (node.right.type === 'Literal' && typeof node.right.value === 'boolean') {
        if (node.left.type === 'Identifier' || node.left.type === 'MemberExpression') {
          const isEquals = node.operator === '==' || node.operator === '===';

          context.report({
            node,
            data: {
              name: getLeftName(node.left),
              value: node.right.value,
            },
            fix(fixer) {
              if (
                (node.right.value && isEquals) ||
                (!node.right.value && !isEquals)
              ) {
                return fixer.replaceTextRange(
                  [
                    node.left.range[1],
                    node.right.range[1],
                  ],
                  ''
                );
              }

              // `!== true`, means `=== false`, replace with `!...`.
              return fixer.replaceText(
                node,
                `!${sourceCode.getText(node.left)}`
              );
            },
            message: "'{{name}}' must use a shortcut, not an explicit comparison to '{{value}}'",
          });
        } else if (node.right.value) {
          context.report({
            node,
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
            message: "'{{name}}' must use a shortcut, not an explicit comparison to '{{value}}'",
          });
        } else {
          context.report({
            node,
            data: {
              name: getLeftName(node.left),
              value: node.right.value,
            },
            message: "'{{name}}' must use a shortcut, not an explicit comparison to '{{value}}'",
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
          data: {
            left: node.object.name,
            right: node.property.name,
          },
          fix(fixer) {
            return fixer
              .replaceTextRange(node.parent.range, `${node.object.name}.${node.property.name}===0`)
            ;
          },
          message: "'{{left}}.{{right}}' must use an explicit comparison, not a shortcut",
        });
      } else if (node.parent.type !== 'BinaryExpression') {
        context.report({
          node,
          data: {
            left: node.object.name,
            right: node.property.name,
          },
          fix(fixer) {
            return fixer.insertTextAfter(node, '>0');
          },
          message: "'{{left}}.{{right}}' must use an explicit comparison, not a shortcut",
        });
      }
    }

    return {
      'BinaryExpression:exit': testBoolean,
      'MemberExpression:exit': testLength,
    };
  },

  meta: {
    docs: {
      category: 'Variables',
      description: 'disallow the use of destructuring props',
      recommended: false,
    },

    fixable: 'code',

    schema: {},
  },
};
