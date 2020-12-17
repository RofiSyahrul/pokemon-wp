const { alias } = require('./.paths');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-dynamic-require': 0,
    'react/jsx-filename-extension': 0,
    'global-require': 0,
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-nested-ternary': 0,
    'import/no-unresolved': [
      2,
      {
        commonjs: true,
        amd: true,
      },
    ],
    camelcase: 'off',
    'react/prop-types': [0],
    'react/destructuring-assignment': 0,
    'react/no-array-index-key': [0],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-wrap-multilines': 0,
    'react/no-access-state-in-setstate': 0,
    'react/jsx-curly-newline': 0,
    'react/display-name': 0,
    'react/jsx-key': [
      2,
      {
        checkFragmentShorthand: true,
      },
    ],
    'react-hooks/exhaustive-deps': 'off',
    'array-callback-return': 0,
    'consistent-return': 0,
    radix: ['warn', 'as-needed'],
    'prefer-const': 'warn',
    'prefer-destructuring': 'warn',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        variables: false,
      },
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-restricted-globals': 'off',
  },
  globals: {
    __DEV__: 'readonly',
    BASE_URL: 'readonly',
    BASE_IMAGE_URL: 'readonly',
    PAGINATION_LIMIT: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      'babel-module': {
        alias,
      },
    },
  },
};
