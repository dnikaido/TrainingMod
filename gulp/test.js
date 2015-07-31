var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    karma = require('karma').server;
var plugins = gulpLoadPlugins();
var defaultTasks = ['env:test', 'karma:unit', 'mochaTest'];

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
    return gulp.src('../server/**/*.js', {read: false})
        .pipe(plugins.mocha({
            reporter: 'spec'
        }));
});

gulp.task('test', defaultTasks);