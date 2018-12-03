# vue-static-router-generator

> 根据路由生成对应静态html文件

## Build Setup

``` bash
# install dependencies

npm install vue-static-router-generator --save #安装静态路由到项目中


----说明 [ 开始 ]-----
找到webpack.prod.conf.js 文件

const VueStaticRouterPlugin=require('vue-static-router-generator');
//文件头部vue-static-router-generator添加引用
//去掉文件文件new HtmlWebpackPlugin() 配置项


//module.export之前添加
new VueStaticRouterPlugin({
  plugins: webpackConfig.plugins,
  routers: [
   { path: "index" }, //生成index.html
   { path: 'details' }],//生成details.html
  commonOptions: {}
});


new VueStaticRouterPlugin({
  plugins: webpackConfig.plugins,
  routers: path.join(__dirname, '../src/router/config.js'),//路由的配置文件
  commonOptions: {}
});


 /*  参数说明
  @plugins 
   webpackConfig.plugins

  @routers = [ { path:'index',isHtml:true,template:"",script:""}]
    @routers 参数
    @path 生成文件名称 
    @isHtml:true ,默认为false, 是否由静态路由接管，如果没引用静态路由请忽略。
    @template :"" 文件名称,
    @script :" " 插入一段js代码，暂时不支持文件插入;

   @commonOptions ={}  HtmlWebpackPlugin默认参数配置

  */

npm run build 查看dist目录下会成功多个html静态文件

----说明 [ 结束 ]-----



