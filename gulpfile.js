const { src, desc, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const { dest } = require('vinyl-fs')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const image = require('gulp-image')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify-es').default
const notify = require('gulp-notify')
const soureceMaps = require('gulp-sourcemaps')
const del = require('del')
const browserSync = require('browser-sync').create()

const clean = () => {
    return del(['dist'])
}

const resources = () => {
    return src('assets/**')
    .pipe(dest('dist'))
}

const styles = () => {
    return src('style/**/*.css')
    .pipe(soureceMaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
        cascade: false,

    }))
    .pipe(cleanCss({
        level: 2
    }))
    .pipe(soureceMaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}


const htmlMinify = () => {
    return src('src/**/*.html')
    .pipe(htmlMin({
        collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const scripts = () => {
    return src([
        'assets/js/**/*.js',
        'js/**/*.js'
    ])
    .pipe(soureceMaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError))
    .pipe(soureceMaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

const images = () => {
    return src([
        'img/**/*.jpg',
        'img/**/*.png',
        'img/**/*.jpeg',
        'img/**/*.svg',
        'img/**/*.webp',
        'assets/img/**/*.jpg',
        'assets/img/**/*.jpeg',
        'assets/img/**/*.png',
        'assets/img/**/*.svg',
        'assets/img/**/*.webp',
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

watch('**.html', htmlMinify)
watch('**.css', styles)
watch('**.js', scripts)
watch('assets/**', resources)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify


exports.default = series(clean, resources, htmlMinify, scripts, styles, images, watchFiles)