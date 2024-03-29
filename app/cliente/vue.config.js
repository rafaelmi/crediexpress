const fs = require('fs');
module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    port: '8080',
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: { '/api': '' }
      },
    },
  },
};
