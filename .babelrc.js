const { alias, src } = require('./.paths');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-optional-chaining',
    '@babel/plugin-proposal-optional-chaining',
    'syntax-dynamic-import',
    [
      'module-resolver',
      {
        root: [src],
        alias,
      },
    ],
  ],
};
