# WebRoot

DataEye内部Java项目前端模板

## assets

静态资源目录，包含:

> * components: Ractive组件(html)
> * css
> * fonts (font-awsome & bootstrap)
> * img 
> * js 

### assets/components

single file components，最终会被转换为js文件。

转换后的JS文件需要国际化（预处理），输出三个语言版本。

### js/app

业务脚本全部放这里

### js/bootstrap

bootstrap的JS插件

### js/ie8

ie8兼容处理脚本

## tpl

全部JSP页面模板。

开发环境使用requirejs的text插件加载。
生产环境会将其转换为AMD模块（builde config设置stubModules: ['text']）。
最终打包输出到app.js。

所以app.js需要国际化（预处理），输出三个语言版本

