/**
 * @fileoverview Rule to flag use of destructured props
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  meta: {
    docs: {
      category: 'Variables',
      description: 'disallow the use of destructuring props',
      recommended: false,
    },

    fixable: 'code',

    schema: {},
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function testBoolean(node) {
      if (node.right.type === 'Literal' && typeof node.right.value === 'boolean') {
        const isEquals = node.operator === '==' || node.operator === '===';
        context.report({
          node,
          data: {
            name: sourceCode.getText(node.left),
            value: node.right.value,
          },
          fix(fixer) {
            if (
              (node.right.value && isEquals) ||
              (!node.right.value && !isEquals)
            ) {
              return fixer.replaceText(
                node,
                sourceCode.getText(node.left)
              );
            }
            if (node.left.operator === 'instanceof') {
              return fixer.replaceText(
                node,
                `!(${sourceCode.getText(node.left)})`
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
            left: sourceCode.getText(node.object),
            right: node.property.name,
          },
          fix(fixer) {
            return fixer
              .replaceTextRange(node.parent.range,
              `${sourceCode.getText(node.object)}.${node.property.name}===0`
            )
            ;
          },
          message: "'{{left}}.{{right}}' must use an explicit comparison, not a shortcut",
        });
      } else if (node.parent.type !== 'BinaryExpression') {
        context.report({
          node,
          data: {
            left: sourceCode.getText(node.object),
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
};
