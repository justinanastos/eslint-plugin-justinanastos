module.exports = {
  root: true,

  extends: [
    "airbnb",
    "plugin:justinanastos/recommended"
  ],

  env: {
    es6: true,
    node: true,
    commonjs: true,
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
    'no-use-before-define': ['warn', { functions: false }],
    'func-names': 'off',
    'new-cap': 'off',
    'no-multi-assign': 'off',
    'no-loop-func': 'off',
    'no-console': 'warn',
    'strict': ['warn', 'safe'],
  }
};
