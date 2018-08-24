//导入工具包 require('node_modules里对应模块')
var gulp     	 = require('gulp'), //本地安装gulp所用到的地方
	rename       = require('gulp-rename'),
	less         = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin 		 = require('gulp-clean-css'),
	concat 		 = require('gulp-concat'),
	uglify		 = require('gulp-uglify'),
	imgmin		 = require('gulp-imagemin'),
	htmlmin 	 = require('gulp-htmlmin');



/*!
 *	===========================================================
 *	== 作者：你爱谁如鲸向海(www.xuehtml.com/me) - 2016-06-27 ==
 * 	===========================================================
 *
 * 	Alvin-Project Task
 *
 *  
 *
 *
 */


// MUI CSS
gulp.task('muicss', function () {
    gulp.src('src/less/miniui.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove:false
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('src/css'));
});

// MUI MIN ICON
gulp.task('minicon', function () {
    gulp.src('src/css/simple-line-icons.css')
        .pipe(cssmin())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('src/css'));
});

// IMAGE MINI
gulp.task('imgminify', function () {
    var options = {
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }
    gulp.src('src/img/*')
        .pipe(imgmin())
        .pipe(gulp.dest('src/images'));
});
