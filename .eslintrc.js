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

  extends: [
    "airbnb",
    "plugin:justinanastos/recommended"
  ],

  env: {
    es6: true,
    node: true,
  },

  plugins: [
    "eslint-plugin-justinanastos"
  ],

  rules: {
    'comma-dangle': [
      'warn',
      {
        arrays: "always-multiline",
        exports: "always-multiline",
        functions: "never",
        imports: "always-multiline",
        objects: "always-multiline",
      }
    ],
    'func-names': 'off',
    'new-cap': 'off',
    'no-multi-assign': 'off',
    'no-loop-func': 'off',
    'no-console': 'warn',
    'strict': ['warn', 'global'],
  }
};
