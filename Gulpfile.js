var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    csscomb = require('gulp-csscomb'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    glob = require('glob'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),

    paths = {
        gulp: ['Gulpfile.js', 'gulp/**/*.js'],
        html: 'index.html',
        media: 'src/media/**/*',
        scripts: 'src/**/*.js',
        styles: 'src/**/*.scss',
        sources: ['dst/**/*.js', 'dst/**/*.css']
    };

gulp.task('scripts', gulp.series(checkScripts, bundleScripts));
gulp.task('build', gulp.series(clean, gulp.parallel(media, 'scripts', styles), html));
gulp.task(clean);
gulp.task(format);
gulp.task(watch);

gulp.task('default', gulp.series('build', watch));

function clean() {
    return del(['dst']);
}

function eslintStream(src, options) {
    return gulp.src(src, options).pipe(eslint()).pipe(eslint.format());
}

function format() {
    return gulp.src(paths.styles, {base: __dirname})
        .pipe(csscomb())
        .pipe(gulp.dest('.'));
}

function html() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dst')) // change file path so relative works
        .pipe(inject(gulp.src(paths.sources, {
            read: false
        }), {relative: true}))
        .pipe(gulp.dest('dst'));
}

function media() {
    return gulp.src(paths.media, {since: gulp.lastRun(media)})
        .pipe(imagemin())
        .pipe(gulp.dest('dst/media'));
}

function checkScripts() {
    return eslintStream(paths.scripts, {since: gulp.lastRun(checkScripts)});
}

function bundleScripts() {
    return browserify('src/client.js', {
        debug: true
    }).transform('babelify', {
        presets: ['es2015', 'react']
    }).bundle().on('error', function(err) {
        gutil.log(err.toString());
    })
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(streamify(uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dst'));
}

function styles() {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
            .pipe(sass({/* outputStyle: 'compressed' */}).on('error', sass.logError))
            .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dst'));
}

function validateGulp() {
    return eslintStream(paths.gulp);
}

function watch() {
    gulp.watch(paths.gulp, validateGulp);
    gulp.watch(paths.media, media);
    gulp.watch(paths.scripts, gulp.series('scripts'));
    gulp.watch(paths.styles, styles);
    gulp.watch([paths.sources, paths.html], html);
}
