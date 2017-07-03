'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import panini   from 'panini';
import yaml     from 'js-yaml';
import fs       from 'fs';

const spritesmith = require('gulp.spritesmith');
const del = require('del');
const newer = require('gulp-newer');//filter existing files based mtime
const debug = require('gulp-debug');//counting of the files passed
const notify = require('gulp-notify');//errors handling (mb platform specific)
const plumber = require('gulp-plumber');//errors handling
const uncache = require('gulp-uncache');//disable browser cashing on changed files 

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
 gulp.series(clean, gulp.parallel( gulp.series( gulp.parallel(sass, javascript), pages ), images, sprites, copy, copyToRoot))
);

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch)
);

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  del(PATHS.delete_dist_options)
    .then(function(){
      done();
  })
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
// |Everithing in "assets" and not in "js", "scss", "img" move to dist without changes (fonts)
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(newer(PATHS.dist))//filter existent files
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// |copies from folder "to-root" to the root of "dist"
function copyToRoot() {
  return gulp.src( PATHS.to_root )
    .pipe(newer(PATHS.dist))//filter existent files
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
    .pipe($.if(PRODUCTION, uncache({//disable browser cashe in production
            append: 'hash',
            rename: false,
            srcDir: 'dist',
            distDir: 'dist'
            })
    ))
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
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'SCSS ERROR!',
        message: err.message
      }))
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
    .on('error', $.sass.logError))
    .pipe($.if(PRODUCTION, $.autoprefixer({ browsers: COMPATIBILITY}) ))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS))) //uncomment if u like the risk (and add at least one option)
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
}

// Combine JavaScript into one file
// In production, the file is minified
// |babel for foundation (todo delete babel dependency)
function javascript() {
  return gulp.src(PATHS.javascript)
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'JS ERROR!',
        message: err.message
      }))
    }))
    .pipe($.sourcemaps.init())
    //.pipe($.babel({ignore: ['what-input.js']}))//Uncomment if you're using Foundation
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
  return gulp.src(PATHS.images)
    .pipe( newer(PATHS.dist + '/assets/img') )//filter existent files
    .pipe( $.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

//Sprites
// |пути через PATHS не работают в некоторых местах
function sprites() {
    var spriteData =
        gulp.src(PATHS.sprites + '*.png') //Sources of images to merge in sprite
            .pipe(plumber({
              errorHandler: notify.onError(err => ({
                title: 'SPRITES ERROR!',
                message: err.message
              }))
            }))
            .pipe(spritesmith({
                imgName: 'sprite.png', //Name of sprite image
                cssName: '_sprites.scss', //file with styles of sprite
                imgPath: '../img/sprites/sprite.png?' + Date.now(), //path to place compiled sprite
                cssFormat: 'scss', //Format of file with sprite styles
                padding: 1,//space between images inside, restart 2 times after changing
                cssVarMap: function(sprite) {
                    sprite.name = 'icon-' + sprite.name //Generate sprite name 'icon-' + name of the file
                }
            }));
    spriteData.img.pipe(gulp.dest('dist/assets/img/sprites/')); // Destination path to the sprite image
    spriteData.css.pipe(gulp.dest('src/assets/scss/components')); // Destination to the scss file with sprite styles
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
// |reload server when changing: static, html, scss, js, images, sprites, fonts
function watch() {

  gulp.watch(PATHS.assets, gulp.series(copy, reload) );
  gulp.watch(PATHS.to_root, gulp.series(copyToRoot, reload) );
  gulp.watch(PATHS.images).on('all', gulp.series(images, reload));

  gulp.watch('src/pages/**/*.html').on('all', gulp.series(pages, reload));
  gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages, reload));
  //gulp.watch('src/assets/scss/**/*.scss').on('all', gulp.series(sass, reload));
  gulp.watch(PATHS.watch_styles).on('all', gulp.series(sass, reload));//Try to fix performance issue
  gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(javascript, reload));
  gulp.watch(PATHS.sprites + '**/*').on('all', gulp.series(sprites, reload));
}




