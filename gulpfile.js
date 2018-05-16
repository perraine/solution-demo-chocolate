// Development/Set-up: 'npm install' then 'gulp watch' to preview development changes
// To deploy - run 'gulp build' check your build then 'gulp netlify' to deploy to netlify (ID and Token currently with David Kidger)

var netlify_id = '';
var netlify_token = '';

var bases = {
    dist: 'dist/',
    src: 'src/',
};

var paths = {
    sass: [bases.src + 'scss/style.scss'],
    corescript: [bases.src + 'scripts/app.js'],
    subscript: [bases.src + 'scripts/config.js'],
    html: [bases.src + '*.html'],

    styles: ['css/*.css'],
    assets: ['assets/**/*.*'],
    fonts: ['fonts/**/*.*'],
    netlify: ['.netlify'],
};

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    netlify = require('gulp-netlify'),
    babel  = require('gulp-babel');
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');
    gutil = require('gulp-util');
    fileinclude  = require('gulp-file-include');
    browserSync = require('browser-sync').create();

// App SCSS Compiling
gulp.task('app-styles', function () {

    // Auto Prefixer and CSS minification
    var processors = [
        autoprefixer('last 2 version'),
        cssnano
    ];

    return gulp.src(paths.sass) // only reference the central .scss file
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(bases.dist + 'css'))
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Styles task complete' }));
});

// Admin SCSS Compiling
gulp.task('admin-styles', function () {

    // Auto Prefixer and CSS minification
    var processors = [
        autoprefixer('last 2 version'),
        cssnano
    ];

    return gulp.src('src/admin/scss/admin.scss') // only reference the central .scss file
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(bases.dist + 'css'))
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Styles task complete' }));
});

// Move and bespoke fonts
gulp.task('fonts', function() {
    del([bases.dist + paths.fonts]);
    gulp.src(bases.src + paths.fonts)
    .pipe(gulp.dest(bases.dist + 'fonts'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Assets task complete' }));
});

// Move and optimize assets
gulp.task('assets', function() {
    del([bases.dist + paths.assets]);
    gulp.src(bases.src + paths.assets)
    .pipe(gulp.dest(bases.dist + 'assets'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Assets task complete' }));
});

// App HTML
gulp.task('app-html', function() {
  gulp.src(['./src/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'HTML task complete' }));
});

// Admin HTML
gulp.task('admin-html', function() {
  gulp.src(['./src/admin/index.html'])
    .pipe(gulp.dest('./dist/admin/'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Admin HTML task complete' }));
});

// App Javascript
gulp.task('app-scripts', function() {
    return gulp.src(['src/scripts/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('app.min.js')) // Combine all seperated scripts
    .pipe(uglify().on('error', gutil.log))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(bases.dist + 'scripts'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'App scripts task complete' }));
});

// Admin Javascript
gulp.task('admin-scripts', function() {
    return gulp.src(['src/admin/scripts/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('admin.min.js')) // Combine all seperated scripts
    .pipe(uglify().on('error', gutil.log))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(bases.dist + 'scripts'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Admin scripts task complete' }));
});

gulp.task('watch', ['clean', 'app-scripts', 'app-styles', 'app-html', 'admin-scripts', 'admin-styles', 'admin-html', 'assets', 'fonts'], function() {

    // Create Browser Sync Server
    browserSync.init({
        server: "./dist/"
    });
    // Create Browser Sync Server

    // Watch .scss files to publish .css, and .js to minify to scr and reload page via Browser Sync
    gulp.watch('src/scss/**/*.scss', ['app-styles']);
    gulp.watch('src/admin/scss/**/*.scss', ['admin-styles']);

    gulp.watch('src/scripts/**/*.js', ['app-scripts']);
    gulp.watch('src/admin/scripts/**/*.js', ['admin-scripts']);

    gulp.watch(bases.src + paths.assets, ['assets']);
    gulp.watch(bases.src + paths.fonts, ['fonts']);

    gulp.watch('src/html/**/*.html', ['app-html']);
    gulp.watch('src/admin/*.html', ['admin-html']);

});

gulp.task('clean', function() {
    del.sync(['dist']);
});

gulp.task('build', function() {

    del(['dist']);

    gulp.start('app-scripts');
    gulp.start('app-styles');
    gulp.start('app-html');
    gulp.start('admin-scripts');
    gulp.start('admin-styles');
    gulp.start('admin-html');
    gulp.start('assets');
    gulp.start('fonts');

});

// Run 'build' before you Netlify
gulp.task('netlify', function () {
  gulp.src('./dist/**/*')
    .pipe(netlify({
      site_id: netlify_id,
      access_token: netlify_token
    }))
})
