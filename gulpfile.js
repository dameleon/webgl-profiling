var gulp = require('gulp');
var typescript = require('gulp-tsc');
var connect = require('gulp-connect');

gulp.task('compile-ts', function() {
    gulp.src(['samples/ts/**/*.ts', '!samples/ts/d.ts', '!samples/ts/d.ts/**'])
        .pipe(typescript({
            target: 'ES5'
        }))
        .pipe(gulp.dest('samples/js/'));
});

gulp.task('develop', ['compile-ts'], function() {
    connect.server({
        root: ['./'],
        port: 3000
    });
    gulp.watch(['samples/ts/**/*.ts'], ['compile-ts']);
});

gulp.task('default', ['compile-ts']);