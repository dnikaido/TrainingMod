var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    plumber     = require('gulp-plumber'),
    refresh     = require('gulp-livereload'),
    mocha       = require('gulp-mocha'),
    compass     = require('gulp-compass'),
    notify      = require('gulp-notify'),
    nodemon     = require('gulp-nodemon'),
    jshint      = require('gulp-jshint'),
    autoprefixer= require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    minifyCss   = require('gulp-minify-css'),
    jade        = require('gulp-jade'),
    gutil       = require('gulp-util'),
    karma       = require('gulp-karma'),
    through     = require('through'),
    fs          = require('fs-extra'),
    _           = require('underscore');

var paths = {
        test: {
            karma : {
                lib:    ['bower_components/angular-mocks/angular-mocks.js'],
                js:     ['public/**/*.js'],
                spec:   ['public/**/*.spec.js'],
                not:    ['public/assets/**']
            }
        },
        public: {
            js:     ['public/**/*.js', '!public/assets/**', '!public/**/*.spec.js'],
            html:   ['public/assets/html/**/*.html'],
            css:    ['public/assets/css/*.css'],
            sass:   ['public/views/sass/**/*.scss'],
            jade:   ['public/views/**/*.jade']
        },
        server: {
            js:     ['*.js', 'server/**/*.js', '!server/**/*.spec.js']
        },
        vendor: {
            js:     ['bower_components/angular/angular.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.js']
        }
    };

gulp.task('env:development', function () {
    process.env.NODE_ENV = 'development';
});

gulp.task('serve', ['env:development'], function(){
    nodemon({
        'script':   'server.js',
        'env':      { 'NODE_ENV': 'development'},
        'ignore':   ['node_modules/'],
        'watch':    paths.server.js
    }).on('start', function() {
        setTimeout(function() {
            refresh();
        }, 2000);
    });
});

gulp.task('lint', function(){
    return gulp.src(paths.public.js)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(count('jshint', 'files lint free'))
        .pipe(notify({message: 'jshint done'}));
});

gulp.task('scripts', function(){
    return gulp.src(paths.vendor.js.concat(paths.public.js))
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/assets/js'))
        .pipe(refresh())
        .pipe(notify({message: 'JS concated'}));
});

gulp.task('sass', function(){
    return gulp.src(paths.public.sass)
        .pipe(plumber())
        .pipe(compass({
            css: 'public/assets/css',
            sass: 'public/views/sass',
            image: 'public/assets/img',
            require: ['susy', 'breakpoint', 'normalize-scss']
        })).on('error', gutil.log)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCss())
        .pipe(gulp.dest('public/assets/css'))
        .pipe(refresh())
        .pipe(notify({message: 'sass done'}));
});

gulp.task('jade', function(){
    return gulp.src(paths.public.jade)
        .pipe(jade()).on('error', gutil.log)
        .pipe(gulp.dest('public/assets/html'))
        .pipe(refresh())
        .pipe(notify({message: 'Views refreshed'}));
});

gulp.task('build', ['jade', 'sass', 'scripts', 'lint', 'testAssets']);

gulp.task('karma', function() {
    return gulp.src([])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }));
});

gulp.task('watch', function(){
    refresh.listen();
    gulp.watch(paths.public.jade, ['jade']);
    gulp.watch(paths.public.js, ['scripts', 'lint']);
    gulp.watch(paths.public.sass, ['sass']);
});

gulp.task('testAssets', function(){
    createTestAssets();
});

function createTestAssets() {
    var testPaths = {
        include: _.union(
            paths.vendor.js,
            paths.test.karma.lib,
            paths.test.karma.js,
            paths.test.karma.spec),
        exclude: paths.test.karma.not
    };

    fs.emptyDir('config', function (err) {
        if(err) {
            gutil.log(err)
        } else {
            fs.writeJson('config/assets.json',testPaths, function(err) {
                if(err) {
                    gutil.log(err);
                }
            });
        }
    });
}

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

gulp.task('dev', ['build', 'serve', 'karma', 'watch']);