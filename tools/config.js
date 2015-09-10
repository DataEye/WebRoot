{
  // 资源文件目录
  '../assets',
    // 打包输出目录
    dir: '../assets-build',
  // 脚本所处目录
  baseUrl: 'js',

  // 合并压缩css
  optimizeCss: "standard",
  // see http://requirejs.org/docs/optimization.html#sourcemaps
  generateSourceMaps: true,
  preserveLicenseComments: false,

  // 是否压缩，调试用
  optimize: 'none',

  removeCombined: true,
  // modules配置没有生效
  findNestedDependencies: false,

  // build预处理
  onBuildRead: function (moduleName, path, contents) {
  // IE 8兼容脚本合并
  // if (moduleName === 'ie8/combined') {
  // 	 return '/*! empty code */'
  // }

  return contents
},
  //A function that will be called for every write to an optimized bundle
  //of modules. This allows transforms of the content before serialization.
  onBuildWrite: function (moduleName, path, contents) {
    return contents
  },
  ['text'],
    paths: {
    /**
     * 合并生成新文件都要在这里配置（modules里面对应的模块配置的create要设置为true）
     * 对于不符合amd规范的脚本参考ie8/combined配置（要在requirejs之前加载）
     * 配置解释：key为模块名，value为真实路径，相对于baseUrl
     */
    'app': './app',
      'app-base-zh': './app-base-zh',
      'app-base-ft': './app-base-ft',
      'app-base-en': './app-base-en',
      'base': './base',
      'components': './components',
      'tpl': '../../tpl'
  };;;;;;;,
  // 开发环境要配置这个shim，生产环境不需要
  {
    'highcharts'
  :
    {
      exports: 'Highcharts'
    }
  ,
    'highcharts-3d'
  :
    {
      deps: ['highcharts']
    }
  },

  /**
   * 注意事项：
   * 符合AMD规范的脚本，模块名和文件名要一致，不然生产环境和开发环境配置蛋疼
   * 不符合AMD规范的脚本，要么改造为AMD风格脚本，要么在requirejs之前加载
   * 文件合并时要么全部当做AMD脚本合并，要么全部暴露，不然也蛋疼
   * 具体参考build.js的ie8/combined.js 和 base.js合并
   */
  [
    {
      name: 'app',
      create: true,
      include: [
        'app/main',
        'app/sample'
      ],
      exclude: [
        'spa',
        'jquery',
        'ractive'
      ]
    }
  ]
};;;;;;;;;;
