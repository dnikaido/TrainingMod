'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    through = require('through'),
    gutil = require('gulp-util'),
    plugins = gulpLoadPlugins(),
    paths = {
        js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', '!node_modules/**', '!public/assets/lib/**/*.js'],
        html: ['public/assets/html/**/*.html'],
        css: ['!bower_components/**', 'public/assets/css/*.css'],
        sass: ['public/views/**/*.scss'],
        jade: ['public/views/**/*.jade']
    };

var defaultTasks = ['jade', 'clean',  'sass', 'csslint', 'devServe', 'watch'];

gulp.task('env:development', function () {
    process.env.NODE_ENV = 'development';
});

gulp.task('jshint', function () {
    return gulp.src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(count('jshint', 'files lint free'));
});

gulp.task('csslint', function () {
    return gulp.src(paths.css)
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.reporter())
        .pipe(count('csslint', 'files lint free'));
});

gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(plugins.compass({
            css: 'public/assets/css',
            sass: 'public/views/',
            image: 'public/assets/img',
            require: ['susy', 'breakpoint']
        })).on('error', gutil.log)
        .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('public/assets/css'));
});

gulp.task('devServe', ['env:development'], function () {

    plugins.nodemon({
        script: 'server.js',
        ext: 'html js',
        env: { 'NODE_ENV': 'development' } ,
        ignore: ['node_modules/'],
        nodeArgs: ['--debug'],
        stdout: false
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if(/Mean app started/.test(chunk)) {
                setTimeout(function() { plugins.livereload.reload(); }, 500);
            }
            process.stdout.write(chunk);
        });
        this.stderr.pipe(process.stderr);
    });
});

gulp.task('jade', function() {
    return gulp.src('public/views/**/*.jade')
        .pipe(plugins.jade().on('error', gutil.log))
        .pipe(gulp.dest('public/assets/html'));
});

gulp.task('watch', function () {
    plugins.livereload.listen({interval:500});

    gulp.watch(paths.jade,['jade']);
    gulp.watch(paths.js, ['jshint']);
    gulp.watch(paths.css, ['csslint']).on('change', plugins.livereload.changed);
    gulp.watch(paths.sass, ['sass']);
});

function count(taskName, message) {
    var fileCount = 0;

    function countFiles(file) {
        fileCount++; // jshint ignore:line
    }

    function endStream() {
        gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
        this.emit('end'); // jshint ignore:line
    }
    return through(countFiles, endStream);
}

gulp.task('development', defaultTasks);