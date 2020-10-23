const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

const paths = {
    root: './static/**',
    css: {
        src: 'assets/sass/*.scss',
        dst: 'static/css'
    },
    img: {
        src: 'assets/img/*',
        dst: 'static/img'
    }
}

gulp.task('css', () => {
    return gulp.src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({debug: true}, details => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css.dst))
});

gulp.task('img', () => {
    return gulp.src(paths.img.src)
        .pipe(imagemin([
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false},
                    {removeUselessDefs: false},
                ]
            })
        ]))
        .pipe(gulp.dest(paths.img.dst))
});

gulp.task('build', gulp.parallel('css', 'img'));

gulp.task('watch', () => {
    gulp.watch(paths.css.src, gulp.series('css'));
    gulp.watch(paths.img.src, gulp.series('img'));
});

gulp.task('default', gulp.series('build', 'watch'));