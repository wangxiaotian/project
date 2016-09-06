 var gulp = require('gulp');
 var fileInclude = require('gulp-file-include');
 var connect = require('gulp-connect');
// 这里写文件路径的时候前面有个./不知道是什么意思，但去掉后就出错了
 gulp.task('fileInclude',function(){
 	gulp.src('./src/page/*.html')
 	.pipe(fileInclude({
 		prefix : '@@'
 	}))
 	.pipe(gulp.dest('./dest/page-test'))
 })
 // 进行监听其实很简单，定义一个任务名称，再添加一个需要执行的任务，
 // 最后再将其添加到gulp启动任务中
gulp.task('watch1',function(){
	gulp.watch(['./src/page/**/*.html'],['fileInclude'])
})

/*
 * 构建服务器
*/

// 使用connect启动一个web服务器
gulp.task('connect',function(){
	connect.server({
		root: '',
		livereload: true
	})
})

// 自动刷新？明白了，其实这里监控的是转化后的文件的变化，并不是转化前的，
// 它进行刷新时，应该是刷新的某一个文件目录
gulp.task('html',function(){
	gulp.src('./dest/page-test/*.html')
	.pipe(connect.reload())
	
})

// 监听文件
gulp.task('watch',function(){
	gulp.watch(['./dest/page-test/*.html'],['html'])
})



// 运行gulp时，默认的task
gulp.task('server',['connect','watch','watch1']);