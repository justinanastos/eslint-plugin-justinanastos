/**
 * @fileoverview Rule to flag use of destructured props
 * @author Justin Anastos
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  create(context) {
    function deepParentIsProps(name, node) {
      if (!node.node.init) { return false; }

      if (node.node.init.name === 'props') {
        return true;
      }

      if (!node.node.init.object) {
        return false;
      }

      return node.node.init.object.type === 'ThisExpression' && node.node.init.property.name === 'props';
    }

    /**
     * Finds and validates all variables in a given scope.
     * @param {Scope} scope The scope object.
     * @returns {void}
     * @private
     */
    function findVariablesInScope(scope) {
      const referenceSet = scope.references.reduce(
        (accumulator, reference) => (
            Object.assign(
              {},
              accumulator,
              {
                [reference.resolved.name]: reference,
              }
          )
        ),
        {}
      );

      Object.keys(referenceSet)
        .forEach((key) => {
          const reference = referenceSet[key];
          const variable = reference.resolved;

          if (deepParentIsProps(variable.name, variable.defs[0])) {
                // Reports.
            context.report({
              data: reference.identifier,
              message: "'{{name}}' was referenced from illegal props destructuring, run remove-props-destructuring codemod.",
              node: variable.defs[0].node.init,
            });
          }
        })
      ;
    }

    /**
     * Validates variables inside of a node's scope.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function findVariables() {
      const scope = context.getScope();

      findVariablesInScope(scope);
    }

    const ruleDefinition = {
      'Program:exit': function (node) {
        const scope = context.getScope();
        const ecmaFeatures = context.parserOptions.ecmaFeatures || {};

        findVariablesInScope(scope);

                // both Node.js and Modules have an extra scope
        if (ecmaFeatures.globalReturn || node.sourceType === 'module') {
          findVariablesInScope(scope.childScopes[0]);
        }
      },
    };

    if (context.parserOptions.ecmaVersion >= 6) {
      ruleDefinition['BlockStatement:exit'] =
        ruleDefinition['SwitchStatement:exit'] = findVariables;

      ruleDefinition['ArrowFunctionExpression:exit'] = function (node) {
        if (node.body.type !== 'BlockStatement') {
          findVariables(node);
        }
      };
    } else {
      ruleDefinition['FunctionExpression:exit'] =
        ruleDefinition['FunctionDeclaration:exit'] =
        ruleDefinition['ArrowFunctionExpression:exit'] = findVariables
      ;
    }

    return ruleDefinition;
  },

  meta: {
    docs: {
      category: 'Variables',
      description: 'disallow the use of destructuring props',
      recommended: false,
    },

    schema: {},
  },
};
