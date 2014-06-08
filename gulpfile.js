// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var jeditor = require('gulp-json-editor');
var concatCss = require('gulp-concat-css');
var clean = require('gulp-clean');


var source = {
	jquery: 'vendor/jquery.js',
	pjax: 'vendor/jquery.pjax.js',
	sidr: 'vendor/jquery.sidr.min.js',
	easytree: 'vendor/jquery.easytree.min.js',
	github: 'vendor/github.js',
	main: 'src/js/gitbrowser-content.js',
	css: 'src/css/*.css',
	manifest: 'src/manifest.json'
}

var filename = {
	js: 'hubrowser.js',
	css: 'hubrowser.css'
}

var build = {
	css: 'dist/css/',
	js: 'dist/scripts/'
}

var chrome = {
	path: 'dist/build/chrome/'
}

// Lint Task
gulp.task('lint', function() {
    return gulp.src(source.main)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src([source.jquery, source.pjax, source.sidr, source.easytree, source.main])
				.pipe(concat(filename.js))
				.pipe(stripDebug())
				.pipe(uglify())
				.pipe(gulp.dest(build.js));
});

gulp.task('css', function(){
	return gulp.src(source.css)
	.pipe(concatCss(filename.css))
	.pipe(gulp.dest(build.css));
	
});

gulp.task('build:chrome',['lint','css', 'scripts'],function(){
	gulp.src(build.css+filename.css)
		.pipe(gulp.dest(chrome.path));
		
	gulp.src(build.js + filename.js)
		.pipe(gulp.dest(chrome.path));
		
	return gulp.src(source.manifest)
			   .pipe(jeditor({
	    		   	'content_scripts': [{
    					'matches': ['https://github.com/*'],
    					'css': [filename.css],
    					'js': [filename.js]
  					}]
	  		  }))
	  		  .pipe(gulp.dest(chrome.path));
});

gulp.task('copy:css', function(){
	return 
});

gulp.task('manifest', ['copy:script', 'copy:css'], function(){
	
});

gulp.task('zip', ['copy:script', 'copy:css','manifest'], function(){
	return gulp.src('tmp/chrome/*')
	.pipe(zip('hubrowser.zip'))
	.pipe(gulp.dest('tmp/'));
});

gulp.task('rename', ['zip'], function(){
	return gulp.src('tmp/hubrowser.zip')
	.pipe(rename('hubrowser.crx'));
});

gulp.task('clean', ['rename'], function(){
	return gulp.src('tmp/chrome/*', {read: false})
	        .pipe(clean());
});

gulp.task('chrome', ['build:chrome']);

// Default Task
gulp.task('default', ['lint', 'scripts', 'css']);