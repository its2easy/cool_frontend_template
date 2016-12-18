'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import panini   from 'panini';
import rimraf   from 'rimraf';
import sherpa   from 'style-sherpa';
import yaml     from 'js-yaml';
import fs       from 'fs';

var spritesmith = require('gulp.spritesmith');


// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from config.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
 gulp.series(clean, gulp.parallel(pages, sass, javascript, images, sprites, copy, copyToRoot))
        );

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
// |всё что в assets и не js, scss, img скидывается а dist без изменений (шрифты)
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// |копирует из папки to-root в корень dist
function copyToRoot() {
  return gulp.src(PATHS.to_root)
    .pipe(gulp.dest(PATHS.dist));
}


// Copy page templates into finished HTML files
function pages() {
  return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(gulp.dest(PATHS.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}


// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('src/assets/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Comment in the pipe below to run UnCSS in production
    .pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(browser.reload({ stream: true }));
}

// Combine JavaScript into one file
// In production, the file is minified
// |babel for foundation
function javascript() {
  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    //.pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src(['src/assets/img/**/*','!src/assets/img/sprites/**/*', '!src/assets/img/sprites'])
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

//Sprites
// |пути через PATHS не работают в некоторых местах
function sprites() {
    var spriteData =
        gulp.src(PATHS.sprites + '*.png') //выберем откуда брать изображения для объединения в спрайт
            .pipe(spritesmith({
                imgName: 'sprite.png', //имя спрайтового изображения
                cssName: '_sprites.scss', //имя стиля где храним позиции изображений в спрайте
                imgPath: '../img/sprites/sprite.png', //путь где лежит спрайт
                cssFormat: 'scss', //формат в котором обрабатываем позиции
                cssVarMap: function(sprite) {
                    sprite.name = 'icon-' + sprite.name //имя каждого спрайта будет состоять из имени файла и конструкции 'icon-'
                }
            }));
    spriteData.img.pipe(gulp.dest('dist/assets/img/sprites/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/assets/scss/components')); // путь, куда сохраняем стили
    return spriteData;
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    server: PATHS.dist, port: PORT
  });
  done();
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
// |релоад сервера при изменении: статика, хтмл, цсс, жс, картинки, спрайты, шрифты
function watch() {
  // gulp.watch(PATHS.assets, copy);
  // gulp.watch(PATHS.to_root, copyToRoot);
  gulp.watch(PATHS.assets).on('all', gulp.series(copy, browser.reload));
  gulp.watch(PATHS.to_root).on('all', gulp.series(copyToRoot, browser.reload));
  gulp.watch('src/pages/**/*.html').on('all', gulp.series(pages, browser.reload));
  gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages, browser.reload));
  gulp.watch('src/assets/scss/**/*.scss').on('all', gulp.series(sass, browser.reload));
  gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(javascript, browser.reload));
  gulp.watch(['src/assets/img/**/*','!src/assets/img/sprites/**/*', '!src/assets/img/sprites']).on('all', gulp.series(images, browser.reload));
  gulp.watch(PATHS.sprites + '**/*').on('all', gulp.series(sprites, browser.reload));
}




