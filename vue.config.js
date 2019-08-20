const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  publicPath: process.env.BASE_URL,
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: ['./src/theme'],
      },
    },
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true,
    },
  },
  lintOnSave: false,
  devServer: {
    port: 3002,
    proxy: {
      '/api': {
        target: process.env.PROXY_TARGET,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
  },
};
