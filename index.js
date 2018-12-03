const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')

function VueStaticRouterGenerator(options) {

    var plugins = options.plugins;
    var routers = options.routers;



    if (typeof routers === 'string') {

        //解析成有效的JSON
        var routerContent = fs.readFileSync(routers, 'utf-8');
        routerContent = routerContent.replace(/\r\n/gi, '').replace(/ /gi, '').replace(/\r/gi, '').replace(/\s+/g, "");
        var jsonStartIndex = routerContent.indexOf('{');
        var jsonLastIndex = routerContent.lastIndexOf('}');

        routerContent = routerContent.substr(jsonStartIndex, jsonLastIndex - jsonStartIndex)


        if (routerContent.indexOf('routes') >= 0) {


            var jsonStartIndex = routerContent.indexOf('routes:[');
            var jsonLastIndex = routerContent.lastIndexOf(']');

            routerContent = routerContent.substr(jsonStartIndex + 7, jsonLastIndex - jsonStartIndex);

        }

        //routerContent = routerContent.replace(/component:\w+\}/gi, '}').replace(/,}/gi,'}');

        //routerContent=JSON.parse(routerContent);
        
        var _routers=[];
        routerContent.split(',{').map(function(item){

         

           var jsonItem={};
         
          item.split(',').map(function(item2){

            // console.log(item2);

             if(item2.indexOf('name:')>=0){
               
               jsonItem.name=item2.substr(item2.indexOf('name:')+5).replace(/\'/gi,'');
             }else if(item2.indexOf('path')>=0)
             {
                 jsonItem.path=item2.substr(item2.indexOf('path:')+5).replace(/\'/gi,'');
             }else if(item2.indexOf('isHtml')>=0)
             {


               var  _isHtml= item2.substr(item2.indexOf('isHtml:')+7).replace(/\'/gi,'');

               //console.log(_isHtml);
               jsonItem.isHtml= _isHtml.indexOf('true')>=0;
             }
          });
          _routers.push(jsonItem);
          console.log(jsonItem);
        })

       // console.log(routerContent);

    routers=_routers;

    }
    //return;
    if (!routers || routers.length == 0) {
        routers = [];
        routers.push({
            //name: 'index',
            isHtml: false,
            path: 'index',
            template: ""
        });
    }


    var _commonOptions = {};

    Object.assign(_commonOptions, {
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        }
    });

    Object.assign(_commonOptions, options.commonOptions);

    var htmlPath = path.resolve(__dirname, '../../index.html');
    console.log(htmlPath);

    var templateContent = fs.readFileSync(htmlPath, 'utf-8');

    //console.log(templateContent);
    //

    routers.map(function(ele) {

        var path = ele.path;
        if (path[0] == "/") {

            path = path.substr(1, path.length - 1);
        }
        var HtmlWebpackPluginOptinos = {
            filename: (path ? path :"index") + '.html',
            templateContent: function(templateParams, compilation) {
                var _templateContent;
                if (ele.filename) {
                    var htmlPath = path.resolve(__dirname, '../../' + ele.template);
                    _templateContent = fs.readFileSync(htmlPath, 'utf-8');
                } else {
                    _templateContent = templateContent;
                }
                return _templateContent.replace('</title>', '</title><script type=text/javascript>var vueStaticRouterConfig=' + JSON.stringify(ele) + ';' + (ele.script || "") + '</script>');
            }
        }
        Object.assign(HtmlWebpackPluginOptinos, _commonOptions);
        plugins.push(new HtmlWebpackPlugin(HtmlWebpackPluginOptinos));
    })


}

module.exports = VueStaticRouterGenerator;