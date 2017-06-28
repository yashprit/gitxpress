import fs from "fs";
import gulp from 'gulp';
import {merge} from 'event-stream'
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import preprocessify from 'preprocessify';
import gulpif from "gulp-if";
import tsc from 'gulp-typescript';
import tslint from 'gulp-tslint';
import sourcemaps from 'gulp-sourcemaps';
import htmlToJs from 'gulp-html-to-js';

const version = require('./package.json').version

const $ = require('gulp-load-plugins')();

var production = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";
var environment = process.env.NODE_ENV || "development";

let tsProject = tsc.createProject('./tsconfig.json');

gulp.task('clean', () => {
  return pipe([`./build`, './tmp'], $.clean())
});

gulp.task('styles', () => {
  return gulp.src('src/styles/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe(gulp.dest('./tmp/style'));
});

gulp.task('html2js', function () {
    return gulp.src('src/scripts/sidebar.template.html')
      .pipe(htmlToJs({
        concat: 'sidebar.template.js'
      }))
      .pipe(gulp.dest('tmp/source/js'));
  });

gulp.task('ts', () => {
  return gulp.src('./src/scripts/**/*.ts')
    .pipe(tsc(tsProject))
    .js.pipe(gulp.dest('./tmp/source/js'));
});

gulp.task('bundle-js',  () => {
  
  return browserify({
      entries: './tmp/source/js/GitXpress.js',
      debug: true
    })
    .transform('babelify', { presets: ['es2015'] })
    .transform(preprocessify, {
      includeExtensions: ['.js']
    })
    .bundle()
    .pipe(source('gitxpress.js'))
    .pipe(buffer())
    .pipe(gulpif(!production, $.sourcemaps.init({ loadMaps: true }) ))
    .pipe(gulpif(!production, $.sourcemaps.write('./') ))
    .pipe(gulpif(production, $.uglify({ 
      "mangle": false,
      "output": {
        "ascii_only": true
      } 
    })))
    .pipe(gulp.dest('./tmp/js/'))
});

gulp.task('js', (cb) => {
  $.runSequence('html2js', 'ts', 'bundle-js', cb)
});

gulp.task('build', (cb) => {
  $.runSequence('clean', 'styles', 'js', cb)
});

gulp.task('default', ['chrome']);

gulp.task('chrome', ['build'], (cb) => {
  return mergeAll('chrome');
});

// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string'
    return stream.pipe(isDest ? gulp.dest(transform) : transform)
  }, gulp.src(src))
}

function mergeAll(dest) {
  return merge(
    pipe('./src/icons/**/*', `./build/${dest}/icons`),
    pipe(['./src/_locales/**/*'], `./build/${dest}/_locales`),
    pipe([`./src/images/${target}/**/*`], `./build/${dest}/images`),
    pipe(['./src/images/shared/**/*'], `./build/${dest}/images`),
    pipe(['./tmp/js/gitxpress.js'], `./build/${dest}/js`),
    pipe(['./tmp/style/*.css'], `./build/${dest}/style`),
    pipe(`./config/${dest}/background.js`, $.babel(), `./build/${dest}/js`),
    pipe(`./config/${dest}/manifest.json`, $.replace('$VERSION', version), `./build/${dest}/`)
  )
}