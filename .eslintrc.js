// Note: Disabled ESLint Rules
//
// Here is the list of ESLint rules we have disabled due to some known issues or because we are just not in favor of that specific rule:
//
// - 'jsx-a11y/anchor-has-content': this is an accessibility rule but it has some issues and does not
// validate properly when We have a component that ends up rendering a link with content.
//
// - 'import/no-dynamic-require': it doesn't work when we do something like  `require('../name' + name);` event though the examples they have
// for valid syntax on require say it should work (https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md#pass)
//
// - 'react/no-unused-prop-types': it doesn't know how to validate PropTypes.shape({...}), and even though it has a option to skip this prop type validation after
// We enable it (skipShapeProps: false) it is still throwing an error for this.
//
// - 'class-methods-use-this': We are not in favor of using static method since it could be difficult for cross development with videoJS integration.

module.exports = {
  root: true,

  extends: 'eslint-config-brooklyn',

  parser: 'babel-eslint',

  env: {
    browser: true,
    es6: true,
    jasmine: true,
    node: true,
  },

  globals: {
    __CLIENT__: true,
    __DEV__: true,
    __PRODUCTION__: true,
    __SERVER__: true,
    config: true
  },

  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: "always-multiline",
        exports: "always-multiline",
        functions: "never",
        imports: "always-multiline",
        objects: "always-multiline",
      }
    ],
    'func-names': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'import/default': 'error',
    'import/extensions': ['error', 'never'],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': [
      'error', {
        devDependencies: true
      }
    ],
    'import/no-named-as-default': 'off',
    'import/no-unresolved': ['error', { 'caseSensitive': true }],
    'import/prefer-default-export': 'off',
    'new-cap': 'off',
    'no-console': 'off',
    'react/no-unused-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/require-extension': 'off',
    'strict': ['error', 'global'],
  },

  settings: {
    'import/resolver': {
      node: {
        extentions: [
          '.js',
          '.jsx'
        ],
        paths: [
          'config'
        ],
      },
    },

    react: {
      version: '15.1.0'
    }
  }
};
