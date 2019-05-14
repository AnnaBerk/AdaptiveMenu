var gulp       = require('gulp'), // Подключаем Gulp
	less         = require('gulp-less'), //Подключаем Less пакет,
	browserSync  = require('browser-sync'); // Подключаем Browser Sync
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
  del          = require('del'); // Подключаем библиотеку для удаления файлов и папок
  rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
  autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
  syntax       = require('postcss-less');

gulp.task('less', function(){ // Создаем таск Sass
	return gulp.src('app/less/**/*.less') // Берем источник
		.pipe(less()) // Преобразуем Less в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('css-min', function() {
	return gulp.src('app/css/*.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('dist/css')); // Выгружаем в папку dist/css
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', function() {
    return gulp.src('app/js/main.js')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', async function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('prebuild', async function() {

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('syntax', function () {
    return gulp.src('app/less/**/*.less')
        .pipe(syntax([]))
        .pipe(gulp.dest('app/less/**/*.less'))
});

gulp.task('watch', function() {
	gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/less/**/*.less', gulp.parallel('less')); // Наблюдение за sass файлами
	gulp.watch('app/js/main.js', gulp.parallel('scripts'));
});

gulp.task('default', gulp.parallel('less', 'browser-sync', 'watch'));

gulp.task('build', gulp.parallel('prebuild', 'css-min', 'clean',  'less', 'scripts'));