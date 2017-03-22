/**
 * @fileoverview Rule to enforce alphabetization of object expressions
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'enforce curly braces surrounding all switch cases',
      recommended: true,
    },

    fixable: 'code',

    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function testBraces(node) {
      if (node.type !== 'SwitchCase') {
        // This is not a `SwitchCase`
        return;
      } else if (node.consequent.length === 0) {
          // There are multiple `case` statements, we can only test the final one because
          // preceeding ones won't have a consequent.
        return;
      }

      if (node.consequent.length > 1 || node.consequent[0].type !== 'BlockStatement') {
        context.report({
          node,
          message: 'switch cases must be surrounded with curly brackets',
          fix(fixer) {
            // Get the entire node source
            const sourceCodeText = sourceCode.getText(node);

            // Add bracket to first line
            const lines = sourceCodeText.split('\n');

            // If the first line ends in a colon, then surround all the code after it in
            // brackets. If the line doesn't end in a colon, then we can't guarantee we
            // can fix it.
            if (lines[0][lines[0].length - 1] === ':') {
              lines[0] += '{';
              lines[lines.length - 1] += '\n}';

              return fixer.replaceText(node, lines.join('\n'));
            }

            return fixer;
          },
        });
      }
    }

    return {
      'SwitchCase:exit': testBraces,
    };
  },
};
