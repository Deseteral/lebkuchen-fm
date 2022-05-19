module.exports = {
  presets: [
    ['@babel/env', { targets: { node: 'current' } }],
    '@babel/typescript',
  ],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['module-resolver', {
      root: ['.'],
      alias: {
        '@service': './src',
      },
    }],
  ],
};
