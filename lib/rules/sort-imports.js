/* eslint-disable func-style */


const enums = ['none', 'type', 'all', 'named', 'default'];
const lower = s => s && s.toLowerCase();

/**
 * Gets the used member syntax style.
 *
 * import 'my-module.js' --> none
 * import * as myModule from 'my-module.js' --> all
 * import {myMember} from 'my-module.js' --> named
 * import {foo, bar} from 'my-module.js' --> named
 * import baz from 'my-module.js' --> default
 * import type { Foo } from 'my-module.js' --> type
 *
 * @param {ASTNode} node - the ImportDeclaration node.
 * @returns {string} used member parameter style
 */
const usedMemberSyntax = (node) => {
  const specifiers = node.specifiers;

  if (!specifiers.length) {
    return 'none';
  } else if (node.importKind === 'type') {
    return 'type';
  } else if (specifiers[0].type === 'ImportNamespaceSpecifier') {
    return 'all';
  } else if (specifiers[0].type === 'ImportDefaultSpecifier') {
    return 'default';
  }

  return 'named';
};

const checkSpecifiers = (context, node, ignoreMemberSort, ignoreCase) => {
  if (!ignoreMemberSort && node.specifiers.length > 1) {
    let pSpecifier;
    let pSpecifierName;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < node.specifiers.length; ++i) {
      const cSpecifier = node.specifiers[i];

      if (cSpecifier.type !== 'ImportSpecifier') {
        // eslint-disable-next-line no-continue
        continue;
      }

      let cSpecifierName = cSpecifier.local.name;

      if (ignoreCase) {
        cSpecifierName = lower(cSpecifierName);
      }

      if (pSpecifier && cSpecifierName < pSpecifierName) {
        const sourceCode = context.getSourceCode();

        context.report({
          data: {
            memberName: cSpecifier.local.name,
          },
          fix(fixer) {
            return fixer.replaceTextRange(
              [
                pSpecifier.range[0],
                cSpecifier.range[1],
              ],
              `${sourceCode.getText(cSpecifier)}, ${sourceCode.getText(pSpecifier)}`
            );
          },
          message: "Member '{{memberName}}' of the import declaration" +
            ' should be sorted alphabetically.',
          node: cSpecifier,
        });
      }

      pSpecifier = cSpecifier;
      pSpecifierName = cSpecifierName;
    }
  }
};

/**
 * Gets the local name of the first imported module.
 * @param {ASTNode} node - the ImportDeclaration node.
 * @returns {?string} the local name of the first imported module.
 */
const getFirstLocalMemberName = node => (
  node.specifiers[0] ? node.specifiers[0].local.name : null
);

module.exports = {
  // eslint-disable-next-line justinanastos/alpha-object-expression
  create(context) {
    const config = context.options[0] || {};
    const ignoreCase = config.ignoreCase || false;
    const ignoreMemberSort = config.ignoreMemberSort || false;
    const memberSyntaxSortOrder = config.memberSyntaxSortOrder || enums;
    const sourceCode = context.getSourceCode();

    let pNode;

    /**
     * Gets the group by member parameter index for given declaration.
     * @param {ASTNode} node - the ImportDeclaration node.
     * @returns {number} the declaration group by member index.
     */
    const getMemberParameterGroupIndex = node =>
      memberSyntaxSortOrder.indexOf(usedMemberSyntax(node));

    return {
      ImportDeclaration(node) {
        if (pNode) {
          const cMemberSyntaxGroupIndex = getMemberParameterGroupIndex(node);
          const pMemberSyntaxGroupIndex = getMemberParameterGroupIndex(pNode);

          let cLocalMemberName = getFirstLocalMemberName(node);
          let pLocalMemberName = getFirstLocalMemberName(pNode);

          if (ignoreCase) {
            pLocalMemberName = lower(pLocalMemberName);
            cLocalMemberName = lower(cLocalMemberName);
          }

          const fixAlpha = fixer => (
            fixer.replaceTextRange(
              [
                pNode.range[0],
                node.range[1],
              ],
              `${sourceCode.getText(node)}\n${sourceCode.getText(pNode)}`
            )
          );

          // When the current declaration uses a different member syntax, then check if the ordering
          // is correct. Otherwise, make a default string compare (like rule sort-vars to be
          // consistent) of the first used local member name.
          if (cMemberSyntaxGroupIndex !== pMemberSyntaxGroupIndex) {
            if (cMemberSyntaxGroupIndex < pMemberSyntaxGroupIndex) {
              context.report({
                node,
                data: {
                  syntaxA: memberSyntaxSortOrder[cMemberSyntaxGroupIndex],
                  syntaxB: memberSyntaxSortOrder[pMemberSyntaxGroupIndex],
                },
                fix: fixAlpha,
                message: 'Expected \'{{syntaxA}}\' syntax before ' +
                  '\'{{syntaxB}}\' syntax.',
              });
            }
          } else if (
            pLocalMemberName &&
            cLocalMemberName &&
            cLocalMemberName < pLocalMemberName
          ) {
            context.report({
              node,
              fix: fixAlpha,
              message: 'Imports should be sorted alphabetically.',
            });
          }
        }

        // Multiple members of an import declaration should also be
        // sorted alphabetically.
        checkSpecifiers(context, node, ignoreMemberSort, ignoreCase);

        pNode = node;
      },
    };
  },

  meta: {
    fixable: 'code',
    schema: [
      {
        additionalProperties: false,
        properties: {
          ignoreCase: {
            type: 'boolean',
          },
          ignoreMemberSort: {
            type: 'boolean',
          },
          memberSyntaxSortOrder: {
            items: {
              enum: enums,
            },
            maxItems: 5,
            minItems: 5,
            type: 'array',
            uniqueItems: true,
          },
        },
        type: 'object',
      },
    ],
  },
};
