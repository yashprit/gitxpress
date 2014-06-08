// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    stripDebug = require('gulp-strip-debug'),
    zip = require('gulp-zip'),
    rename = require('gulp-rename'),
    jeditor = require('gulp-json-editor'),
    concatCss = require('gulp-concat-css'),
    clean = require('gulp-clean');


var source = {
    jquery: 'vendor/jquery.js',
    pjax: 'vendor/jquery.pjax.js',
    sidr: 'vendor/jquery.sidr.min.js',
    easytree: 'vendor/jquery.easytree.min.js',
    github: 'vendor/github.js',
    main: 'src/js/gitbrowser-content.js',
    css: 'src/css/*.css',
    manifest: 'src/manifest.json'
},
    filename = {
        js: 'hubrowser.js',
        css: 'hubrowser.css'
    },
    build = {
        css: 'dist/css/',
        js: 'dist/scripts/'
    },
    chrome = {
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

gulp.task('css', function() {
    return gulp.src(source.css)
        .pipe(concatCss(filename.css))
        .pipe(gulp.dest(build.css));

});

gulp.task('build:chrome', ['lint', 'css', 'scripts'], function() {
    gulp.src(build.css + filename.css)
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

// Default Task
gulp.task('default', ['lint', 'scripts', 'css']);

gulp.task('chrome', ['build:chrome']);