var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify');
var rename = require('gulp-rename');
var sh = require('shelljs');

var minify = require('gulp-minify');

var argv = require('yargs').argv;
var mid = 0;

for (arg in argv){
  if (argv[arg] === true){
    mid = parseInt(arg,16); // yeah, counting to f ;)
  }
}
var libs= [
  "./www/lib/ionic/release/js/ionic.bundle.js",
  "./www/lib/moment/min/moment.min.js","./www/lib/angular-moment/angular-moment.min.js","./www/lib/moment/locale/fr.js","./www/lib/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js","./www/lib/openfb/openfb.js",
  "./www/lib/ngstorage/ngStorage.min.js","./www/lib/leaflet/dist/leaflet.js","./www/lib/angular-simple-logger/dist/angular-simple-logger.js","./www/lib/angular-leaflet-directive/dist/angular-leaflet-directive.min.js","./www/lib/ngCordova/dist/ng-cordova.min.js","./www/cordova.js"
  //, /* BUGGY */ "./www/lib/ng-walkthrough/ng-walkthrough.js"
]


var paths = {
  sass: ['./scss/**/*.scss'],
  js: [
    './www/js/*.js','./www/WhatTheFood/shared/*.js','./www/WhatTheFood/shared/**/*.js','./www/WhatTheFood/components/**/*.js'
  ],
  lib: libs,

  lib1: libs.slice(0,mid),
  mid : libs[mid],
  lib2: libs.slice(mid + 1)
};

/*
 gulp.task('watch', function() {
 gulp.watch(paths.js, ['concat']);
 });
 */

gulp.task('dbg', ['concat-lib1','concat-lib2','concat-mid']);

gulp.task('concat-lib1',function(){
  return gulp.src(paths.lib1)
    .pipe(concat('lib1-bundle.js'))
    .pipe(gulp.dest('./www/dist/'));
})
gulp.task('concat-lib2',function(){
  return gulp.src(paths.lib2)
    .pipe(concat('lib2-bundle.js'))
    .pipe(gulp.dest('./www/dist/'));
})
gulp.task('concat-mid',function(){
  return gulp.src(paths.mid)
    .pipe(concat('mid-bundle.js'))
    .pipe(gulp.dest('./www/dist/'));
})


gulp.task('concat', ['concat-src','concat-lib']);

gulp.task('concat-all', ['minify'],function(){
  return gulp.src(['./www/dist/lib-bundle-min.js','./www/dist/app-bundle-min.js'])
    .pipe(concat('bundle-min.js'))
    .pipe(gulp.dest('./www/dist/'));
})

gulp.task('concat-src', function() {
  return gulp.src(paths.js)
    .pipe(concat('app-bundle.js'))
    .pipe(gulp.dest('./www/dist/'));
});

gulp.task('concat-lib', function() {
  return gulp.src(paths.lib)
    .pipe(concat('lib-bundle.js'))
    .pipe(gulp.dest('./www/dist/'));
});


gulp.task('minify', ['concat'],function() {
  return gulp.src(['./www/dist/app-bundle.js','./www/dist/lib-bundle.js'])
    .pipe(minify({mangle:false}))
    .pipe(gulp.dest('./www/dist'));
});




gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('concat-and-minify', ['concat','minify']);

gulp.task('default', ['concat-and-minify']);
