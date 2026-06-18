// pm2 process config for the Med-X SSR server.
// Start with: pm2 start ecosystem.config.cjs  (from /var/www/med-x)
// nginx (vhost med-x) proxies https://med-ix.ru → 127.0.0.1:3050.
module.exports = {
  apps: [
    {
      name: "med-x-ssr",
      script: "./node_modules/@react-router/serve/dist/cli.js",
      args: "./build/server/index.js",
      env: {
        PORT: "3050",
        NODE_ENV: "production",
      },
    },
  ],
};
