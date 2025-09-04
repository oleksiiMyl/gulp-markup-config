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

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  gulp.watch('src/index.pug', gulp.series('pug', browserSync.reload));
  gulp.watch('src/styles/main.scss', gulp.series('sass', browserSync.reload));
  gulp.watch('src/scripts/main.js', gulp.series('script', browserSync.reload));
});

gulp.task('images', () =>
  gulp
    .src('src/images/**/*.+(png|jpg|jpeg|gif|svg)', { encoding: false })
    .pipe(gulp.dest('dist/images'))
);

gulp.task('clean', () => del.deleteAsync('dist'));

gulp.task('default', gulp.series('pug', 'sass', 'script', 'serve'));

gulp.task('build', gulp.series('clean', 'pug', 'sass', 'script', 'images'));
