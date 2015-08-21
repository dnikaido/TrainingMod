var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    karma = require('karma').server,
    plugins = gulpLoadPlugins(),
    defaultTasks = ['env:test', 'karma:unit', 'mochaTest'],
    watchTasks = ['env:test', 'mochaTest', 'watch'];

var testFiles = [
    '../server/**/*.spec.js',
    '../public/**/*.spec.js'
];

gulp.task('env:test', function () {
    process.env.NODE_ENV = 'test';
});

gulp.task('karma:unit', function (done) {
    karma.start({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: true
    }, function () {
        done();
    });
});

gulp.task('mochaTest', function () {
    return gulp.src(testFiles, {read: false})
        .pipe(plugins.mocha({
            reporter: 'spec'
        }));
});

gulp.task('watch', function() {
    gulp.src(testFiles)
        .pipe(plugins.karma({
            configFile: __dirname + '/../karma.conf.js',
            action: 'watch'
        }));
});

gulp.task('test', defaultTasks);
gulp.task('test-dev', watchTasks);