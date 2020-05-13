//Подключаем галп
const gulp = require('gulp');
//Объединение файлов
const concat = require('gulp-concat');
//Добавление префиксов
const autoprefixer = require('gulp-autoprefixer');
//Оптисизация стилей
const cleanCSS = require('gulp-clean-css');
//Оптимизация скриптов
const uglify = require('gulp-uglify');
//Удаление файлов
const del = require('del');
//Синхронизация с браузером
const browserSync = require('browser-sync').create();
//Для препроцессоров стилей
const sourcemaps = require('gulp-sourcemaps');
//Sass препроцессор
const sass = require('gulp-sass');
//Less препроцессор
const less = require('gulp-less');
//Stylus препроцессор
const stylus = require('gulp-stylus');
const imagemin = require('gulp-imagemin');

//Порядок подключения файлов со стилями
const styleFiles = [
   './src/scss/uikit.scss',
   './src/scss/main.scss'
]
//Порядок подключения js файлов
const scriptFiles = [
   'node_modules/uikit/dist/js/uikit.min.js',
   './src/js/main.js'
]

//Таск для обработки стилей
gulp.task('styles', () => {
   //Шаблон для поиска файлов CSS
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src(styleFiles)
      .pipe(sourcemaps.init())
      //Указать stylus() , sass() или less()
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 2 versions'],
         cascade: false
      }))
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(sourcemaps.write('./'))
      //Выходная папка для стилей
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
});

//Таск для обработки скриптов
gulp.task('scripts', () => {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src(scriptFiles)
      //Объединение файлов в один
      .pipe(concat('script.js'))
      //Минификация JS
      .pipe(uglify({
         toplevel: true
      }))
      //Выходная папка для скриптов
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
   return del(['build/*'])
});

gulp.task('img-compress', () => {
   return gulp.src('./src/img/**')
   /*.pipe(imagemin({
      progressive: true
   }))*/
   .pipe(gulp.dest('./build/img/'))
});
gulp.task('svg-compress', () => {
   return gulp.src('./src/svg/**')
   .pipe(gulp.dest('./build/svg/'))
});
gulp.task('fonts-compress', () => {
   return gulp.src('./src/fonts/**')
   .pipe(gulp.dest('./build/fonts/'))
});

//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
   gulp.watch('./src/img/**', gulp.series('img-compress'))
   gulp.watch('./src/svg/**', gulp.series('svg-compress'))
   gulp.watch('./src/fonts/**', gulp.series('fonts-compress'))
   //Следить за файлами со стилями с нужным расширением
   gulp.watch('./src/scss/**', gulp.series('styles'))
   //Следить за JS файлами
   gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
   //При изменении HTML запустить синхронизацию
   gulp.watch("./*.html").on('change', browserSync.reload);
});

//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'img-compress', 'svg-compress', 'fonts-compress'), 'watch'));