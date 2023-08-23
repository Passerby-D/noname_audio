const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:'./',
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'cell-line-height': '12px',
          },
        },
      },
    },
  },
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': { // 匹配所有以'/api1' 开头的请求路径
        target: 'http://192.168.0.192:54128', // 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }

  /*   devServer:{
      porxy:'http//localhost:54128'npm run serve
      
    } */
  // 配置跨域
  /*   devServer:{
      proxy:{
        '/api':{
          // 配置跨域，也就是只要url里面含有api，那么基址就会随着我们的target的改变而改变
          target:'http//localhost:3000',
          changeOrigin:true
  
  
          /home/getData
          http//localhost:3000/api/home/getData
  http//localhost:3000/getData
        }
      }
    } */
})
