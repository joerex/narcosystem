var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    ls = require('gulp-live-server'),
    ts = require('gulp-typescript'),
    inject = require('gulp-inject'),
    runSequence = require('run-sequence'),
    gls = require('gulp-live-server'),
    series = require('stream-series');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('styles', function() {
  return gulp.src('src/app/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/app/styles/'))
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets/'))
});

gulp.task('html', function() {
  return gulp.src('src/app/**/*.html')
    .pipe(gulp.dest('dist/app/'))
});

gulp.task('js', function() {
    var tsResult = gulp.src('src/app/**/*.ts') // instead of gulp.src(...)
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('dist/app/'));
});

gulp.task('libs', function () {
    return gulp.src([
          'node_modules/angular2/bundles/http.dev.js',
          'node_modules/angular2/bundles/angular2.dev.js',
          'node_modules/systemjs/dist/system.src.js'
        ])
      .pipe(gulp.dest('dist/libs'));
});

gulp.task('index', function () {
  var target = gulp.src('src/index.html');
  var system = gulp.src(['dist/libs/system.src.js'], {read: false});
  var libs = gulp.src([
    'dist/libs/*.js',
    '!dist/libs/system.src.js',
    'dist/app/styles/*.css'
  ], {read: false});

  return target.pipe(inject(series(system, libs), {ignorePath: '/dist'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch('src/app/styles/*.scss', ['styles']);
    gulp.watch('src/app/**/*.ts', ['js']);
    gulp.watch('src/app/**/*.html', ['html']);
    gulp.watch('src/assets/*', ['assets']);
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('serve', function() {
  var server = gls.static('dist', 8888);
  server.start();

  //use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch(['dist/**/*'], function (file) {
    server.notify.apply(server, [file]);
  });
});

gulp.task('default', ['styles', 'js', 'html', 'assets', 'libs', 'watch', 'serve']);

gulp.task('all', function() {
  runSequence('styles', 'js', 'html', 'assets', 'libs', 'index', 'watch', 'serve');
});
