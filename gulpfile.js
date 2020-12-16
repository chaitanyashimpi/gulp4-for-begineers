const gulp          = require('gulp');
const sass          = require('gulp-sass');
const browserSync   = require('browser-sync').create();
const useref        = require('gulp-useref');
const uglify        = require('gulp-uglify');
const gulpIf        = require('gulp-if');
const cssnano       = require('gulp-cssnano');
const imagemin      = require('gulp-imagemin');
const cache         = require('gulp-cache');
const del           = require('del');
const runSequence   = require('gulp4-run-sequence');

// Main Gulp Task

// Compile sass into CSS and auto inject into browsers
gulp.task('sass', function(){
    return gulp.src("app/scss/**/*.+(sass|scss)")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Statis Server + watching scss/html/js files
gulp.task('server', gulp.series('sass', function(){
    browserSync.init({
        server: "./app/"
    });
    gulp.watch("app/scss/**/*.+(sass|scss)", gulp.series('sass'));
    gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('server'));



// Optimization Tasks

// Minifying the Js files
gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if its a Javascript file
    .pipe(gulpIf('*.js',uglify()))
    .pipe(gulp.dest('dist'))
});

// Minifying the CSS files
gulp.task ('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    // Minify only if its a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Optimizing the Images
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// Copying the fonts in dist
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// // Cleaning 
// gulp.task('clean', function() {
//     return del.sync('dist').then(function(cb) {
//         return cache.clearAll(cb);
//     });
// })

// gulp.task('clean:dist', function() {
//     return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
// });

// Build Sequences
// ---------------

gulp.task('build', function(callback) {
    runSequence(
        // 'clean:dist',
        'sass',['useref', 'images', 'fonts'],
        callback
    )
})
