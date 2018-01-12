module.exports = {
  apps : [
    {
      name      : 'API',
      script    : 'dist/index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
