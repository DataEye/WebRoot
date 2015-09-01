# WebRoot

DataEye内部Java项目前端模板

## 目录结构

> * assets 静态资源（js/css/fonts/images），用于本地开发
> * assets-build 静态资源打包压缩版，用于正式上线
> * includes 用于服务端包含的JSP文件
> * includes/templates 业务模板文件
> * pages 业务页面
> * super 管理页面
> * templates 插件模板文件
> * tools 打包工具集（node.js编写）
> * .editorconfig 编辑器配置文件
> * .gitignore git版本管理配置文件
> * index.html 默认跳转页面

## 开发独立页面

直接在pages目录下创建jsp，参考home.jsp页面（一般用于数据中心）。

## 开发单页应用

入口文件为main.jsp。模板放在includes/templates目录下，js放在assets/js/app下。

jsp创建完成后记得`cd tools`再执行`npm run sync`同步模板文件

## 检测国际化

`cd tools`再执行`npm run i18n`
