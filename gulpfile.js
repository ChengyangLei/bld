// 引入 gulp
var gulp = require('gulp');
 
// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息
 
// 压缩html
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('release/app/'))
    .pipe(notify({ message: 'html task ok' })); 
});

// 压缩html
gulp.task('indexhtml', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('release/'))
    .pipe(notify({ message: 'html task ok' })); 
});
 
// 压缩图片
gulp.task('img', function() {
  return gulp.src('static/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(gulp.dest('release/static/img'))
    .pipe(notify({ message: 'img task ok' }));
});

// copyfonts
gulp.task('copyfonts', function() {
  return gulp.src('static/fonts/*')
    .pipe(gulp.dest('release/static/fonts'))
    .pipe(notify({ message: 'copyfonts task ok' }));
});

// copyresource
gulp.task('copyresource', function() {
  return gulp.src('static/resource/*')
    .pipe(gulp.dest('release/static/resource'))
    .pipe(notify({ message: 'copyresource task ok' }));
});
 
// 合并、压缩、重命名css
gulp.task('css', function() {
  return gulp.src('static/css/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('release/static/css'))
    .pipe(notify({ message: 'css task ok' }));
});
 
// 检查js
gulp.task('lint', function() {
  return gulp.src('static/*/src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});
 
// 合并、压缩js文件
gulp.task('js', function() {
  return gulp.src(['static/*/src/*.js','static/*.js'])
    .pipe(uglify({
      mangle:{except:['require','exports','module','$']}
    }))
    .pipe(gulp.dest('release/static/'))
    .pipe(notify({ message: 'js task ok' }));
});

// 合并、压缩js文件
gulp.task('modulejs', function() {
  return gulp.src('module/*.js')
    .pipe(uglify({
      mangle:{except:['require','exports','module','$']}
    }))
    .pipe(gulp.dest('release/module/'))
    .pipe(notify({ message: 'js task ok' }));
});

// copymodule
gulp.task('copymodule', function() {
  return gulp.src('module/*/**')
    .pipe(gulp.dest('release/module/'))
    .pipe(notify({ message: 'js task ok' }));
});
 
// 默认任务
gulp.task('default', function(){
  gulp.run('img', 'css', 'lint','copymodule', 'js','modulejs', 'html' ,'indexhtml' , 'copyfonts','copyresource');
});

// 默认任务
// gulp.task('buildjs', function(){
//   gulp.run('copymodule');
// });