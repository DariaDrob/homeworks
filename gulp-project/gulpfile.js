const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');

const PLUGINS = [
    autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    })
];

function styles() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(PLUGINS))
        .pipe(csso())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
}

function watch() {
    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch('src/*.html').on('change', gulp.series(html, browserSync.reload));
}

function html() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
}

exports.styles = styles;
exports.watch = watch;
exports.html = html;
exports.default = gulp.parallel(html, styles, gulp.series(serve, watch));