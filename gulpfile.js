const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postCSS = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');

gulp.task('pug', () =>
  gulp
    .src('src/index.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist/'))
);

gulp.task('sass', () =>
  gulp
    .src('src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postCSS([autoprefixer('last 2 versions')]))
    .pipe(cleanCSS({ compatibility: 'ie9' }))
    .pipe(gulp.dest('dist/styles'))
);

gulp.task('script', () =>
  gulp
    .src('src/scripts/main.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
);

function reload(done) {
  browserSync.reload();
  done();
}

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  gulp.watch('src/**/*.pug', gulp.series('pug', reload));
  gulp.watch('src/styles/**/*.scss', gulp.series('sass', reload));
  gulp.watch('src/scripts/**/*.js', gulp.series('script', reload));
});

gulp.task('assets', () =>
  gulp.src('src/assets/**/*', { encoding: false }).pipe(gulp.dest('dist/assets'))
);

gulp.task('clean', () => del.deleteAsync('dist'));

gulp.task('default', gulp.series('pug', 'sass', 'script', 'serve'));

gulp.task('build', gulp.series('clean', 'pug', 'sass', 'script', 'assets'));
