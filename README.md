胖胖生活便利店后台中心
===========================

## 环境依赖：

1. java
1. tomcat7

## 版本管理
* git

## 目录说明：

* js目录下放js文件
* css目录下放css文件
* img目录下放图片文件
* fonts目录下放fonts文件
* resource 目录下放已生成的不可更改资源数据文件
* index.html 文件是入口php
	* app			```静态HTML文件```
	* module		```第三方库，插件等web工具和项目交互验证文件```
	* static		```静态资源```
	* index.html

## 开发工具：
* Sublime Text2

## web库 / 框架
* jQuery
* Seajs
* Layer.js
* artTemplate.js
* Bootstart.js
* jQuery UI

## 构建工具
* Gulp

## 自动化测试
* jshint

##性能优化
* gulp-htmlmin ```HTML压缩```
* gulp-imagemin ```Image压缩```
* gulp-minify-css ```CSS压缩```
* gulp-uglify ```Js压缩```
* FireFox YSlow  ```性能检测优化```

## 兼容性
* Chrome
* Safari 2.0+
* FireFox 1.5+
* Opera 9.0+




## 运行方法：

1. clone git Projects
	* 获取项目 ```git clone https://gitlab.qtz.com/ppcs_front_grp/bld.git```
1. 配资项目环境
	* java
	* tomcat7
1. 启动tomcat服务器
    * startup.bat
1. 刷新页面（ http://127.0.0.1:8080/ ），查看效果

> ps: 配置完项目环境之后请检查cd tomcat7/conf/server.xml 项目地址是否指向根目录


## 资源文件gulp.js示例

### 代码

```php
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin')
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('release/app/'))
    .pipe(notify({ message: 'html task ok' })); 
});
gulp.task('default', function(){
   gulp.run('html');
});
```


## 配置文件package.json示例

### 代码
```php
{
  "name": "bld",
  "version": "1.0.0",
  "description": "this is a bld",
  "main": "gulpfile.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "panbing",
  "license": "ISC",
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.0",
    "gulp-htmlmin": "^2.0.0",
    "gulp-imagemin": "^3.0.1",
    "gulp-jshint": "^2.0.1",
    "gulp-minify-css": "^1.2.4",
    "gulp-notify": "^2.2.0",
    "gulp-rename": "^1.2.2",
    "gulp-uglify": "^1.5.3",
    "imagemin-pngcrush": "^5.0.0",
    "jshint": "^2.9.2"
  }
}
```

###关于
```javascript
var json = {
	name:'潘冰',
	site:'github.com/cupsbbb'
}
```