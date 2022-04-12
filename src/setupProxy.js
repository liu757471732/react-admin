
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://eyesight.news.qq.com/',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '',
            }
        })
    );
    // 多个的备用
    // app.use(
    //     '/apc',
    //     createProxyMiddleware({
    //         target: 'https://api.inews.qq.com/',
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/apc': '',
    //         }
    //     })
    // );
};