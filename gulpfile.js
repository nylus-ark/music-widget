'use strict';

const gulp = require('gulp');
const del = require('del');
const path = require('path');

const rename = require('gulp-rename');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

const htmlmin = require('gulp-htmlmin');
const htmlreplace = require('gulp-html-replace');
const fileinclude = require('gulp-file-include');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const svgstore = require('gulp-svgstore');
const svgo = require('gulp-svgo');

const fs = require('fs');
const server = require('browser-sync').create();

const paths = {
  build: './build',

  src: './source',
  views: './source',
  styles: './source/scss',
  js: './source/js',

  htmlincludes: './source/views',
};

gulp.task('styles', function () {
  const processors = [
    autoprefixer()
  ];

  return gulp.src([
      paths.styles + '/style.scss',
    ])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.build + '/css/'))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.build + '/css/'))
    .pipe(server.stream());
});

gulp.task('render-view', function () {
  let v = + new Date();

  return gulp.src([
      paths.views + '/*.html',
    ])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: paths.htmlincludes,
      }).on('error', function(error) {
        console.error('File include error', error);
      })
    )
    .pipe(htmlreplace({
      'js': 'js/scripts.min.js?v=' + v,
      'css': 'css/style.min.css?v=' + v
    }))
    .pipe(htmlmin({
      collapseWhitespace: false,
      // collapseWhitespace: true,
      // conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.build))
    .pipe(server.stream());
});

gulp.task('clean', function () {
  return del(paths.build);
});

gulp.task('copy', function() {
  return gulp.src([
      paths.src + '/img/**/*.{png,jpg}',
      paths.src + '/fonts/**/*'
    ], {
      base: paths.src
    })
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-js', function () {
  return gulp.src([
      paths.js + '/**/*.js',
    ], {
      base: paths.js
    })
    .pipe(concat('app.js'))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('svg-store', function () {
  return gulp.src(paths.src + '/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(paths.build + '/img/'));
});

gulp.task('build-dev', gulp.series('clean', gulp.parallel('styles', 'render-view'), 'copy', 'copy-js', 'svg-store'));

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'render-view'), 'copy', 'copy-js', 'svg-store'));

gulp.task('server', function () {
  server.init({
    server: paths.build,
    notify: false,
    open: true,
    ui: false
  })

  gulp.watch(paths.styles + '/**/**/**/*.scss', gulp.series('styles'));
  gulp.watch(paths.views + '/**/**/*.html', gulp.series('render-view'));
  gulp.watch(paths.src + '/img/**/*', gulp.series('copy'));

  gulp.watch(paths.js + '/**/*', gulp.series('copy-js'));
});

gulp.task('default', gulp.series('build-dev', 'server'));

gulp.task('prod', gulp.series('build'));
gulp.task('serve', gulp.series('default'));
