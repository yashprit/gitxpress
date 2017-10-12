import fs from "fs";
import gulp from 'gulp';
import { merge } from 'event-stream'
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gulpif from "gulp-if";
import sourcemaps from 'gulp-sourcemaps';
import sassInlineSvg from 'gulp-sass-inline-svg';
import svgmin from 'gulp-svgmin';
import runSequence from 'run-sequence';
import tsify from 'tsify';

const $ = require('gulp-load-plugins')();

const version = require('./package.json').version
const name = require('./package.json').name;

const keyPath = process.env.key;

const production = process.env.NODE_ENV === "production";
const target = process.env.TARGET || "chrome";
const environment = process.env.NODE_ENV || "development";

gulp.task('sass:svg', function(){
  return gulp.src('./src/icons/seti_ui_icon/*.svg') 
    .pipe($.svgmin())
    .pipe($.sassInlineSvg({
      destDir: './src/styles'
    }));
});

gulp.task('clean', () => {
  return pipe(`./build`, $.clean())
});

gulp.task('styles', () => {
  return gulp.src(['src/styles/index.scss', './node_modules/selectize/dist/css/selectize.css'])
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.concat('gitxpress.css'))
    .pipe(gulp.dest(`./build/${target}/style`));
});

gulp.task('vendor', () => {
  let src = [
    './src/vendor/bootstrap-treeview.js',
    './src/vendor/jquery-popover.js'
  ]
  return pipe(src, $.concat('gitxpress-vendor.js'), `./build/${target}/js`);
})

gulp.task('bundle-js',  () => {
  return browserify({
    basedir: '.',
    entries: './src/scripts/Main.ts',
    debug: true
  })
  .plugin('tsify')
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
  .pipe(gulp.dest(`./build/${target}/js`))
});

gulp.task('js', (cb) => {
  runSequence('bundle-js', 'vendor', cb)
});

gulp.task('build', (cb) => {
  runSequence('clean', 'styles', 'js', `${target}`);
});

gulp.task('default', ['chrome']);

gulp.task('chrome', (cb) => {
  return mergeAll();
});

gulp.task('watch', ['chrome'], () => {
  $.livereload.listen();
  gulp.watch(['./src/**/*']).on("change", () => {
    runSequence('chrome', $.livereload.reload);
  });
});

// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string'
    return stream.pipe(isDest ? gulp.dest(transform) : transform)
  }, gulp.src(src))
}

function mergeAll() {
  return merge(
    pipe('./src/icons/**/*', `./build/${target}/icons`),
    pipe(['./src/_locales/**/*'], `./build/${target}/_locales`),
    pipe([`./src/images/${target}/**/*`], `./build/${target}/images`),
    pipe(['./src/images/shared/**/*'], `./build/${target}/images`),
    pipe(`./src/${target}/FirebaseConfig.js`, $.babel(), `./build/${target}/js`),
    pipe(`./src/${target}/Extension.js`, $.babel(), `./build/${target}/js`),
    pipe(`./src/${target}/Proxy.js`, $.babel(), `./build/${target}/js`),
    pipe(`./src/${target}/container.html`, `./build/${target}/`),
    pipe(`./src/${target}/manifest.json`, $.replace('$VERSION', version), `./build/${target}/`)
  )
}