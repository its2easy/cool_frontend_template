'use strict';

const plugins = require('gulp-load-plugins')(),
     yargs = require('yargs'),
     browser = require('browser-sync'),
     gulp = require('gulp'),
     panini = require('panini'),
     spritesmith = require('gulp.spritesmith'),
     del = require('del');

// load by 'gulp-load-plugins': gulp-autoprefixer, gulp-babel, gulp-concat, gulp-cssnano, gulp-if, gulp-imagemin, gulp-sass,
//gulp-sourcemaps, gulp-uglify, gulp-notify, gulp-plumber
//gulp-newer - filter existing files based mtime
//gulp-uncache - disable browser cashing on changed files

const PATHS = {
        dist: 'dist',
        delete_dist_options: [
            "dist/**/*",
            "!dist/composer.json",
            "!dist/index.php",
            "!dist/.git",
            "!dist/.git/**/*"
        ],
        assets: [
            "src/assets/**/*",
            "!src/assets/{img,js,scss}",
            "!src/assets/{img,js,scss}/**/*"
        ],
        scss_main_file: 'src/assets/scss/app.scss',
        to_root: "src/to-root/**/*",
        images: [
            "src/assets/img/**/*",
            "!src/assets/img/sprites/**/*",
            "!src/assets/img/sprites"
        ],
        watch_styles: "src/assets/scss/**/*.scss",
        sprites: "src/assets/img/sprites/",
        javascript: [
            "src/assets/js/vendor/jquery/jquery-3.3.1.js",
            "src/assets/js/vendor/bootstrap4/bootstrap.bundle.js",
            "src/assets/js/vendor/slick/slick.js",
            "src/assets/js/!(app).js",
            "src/assets/js/app.js",
        ],
        //option if js doesn't need to be compiled
        //javascript: "src/assets/js/**/*",
    },
    OPTIONS = {
        port: 8000
    };

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  del(PATHS.delete_dist_options)
    .then(function(){
      done();
  })
}

//================ FILES

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
// |Everithing in "assets" and not in "js", "scss", "img" move to dist without changes (fonts, css)
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(plugins.newer(PATHS.dist))//filter existent files
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// |copies from folder "to-root" to the root of "dist"
function copyToRoot() {
  return gulp.src( PATHS.to_root )
    .pipe(plugins.newer(PATHS.dist))//filter existent files
    .pipe(gulp.dest(PATHS.dist));
}

//================ HTML

// Copy page templates into finished HTML files
// docs https://foundation.zurb.com/sites/docs/panini.html
function pages() {
  return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(plugins.if(PRODUCTION, plugins.uncache({//disable browser cashe in production
                append: 'hash', rename: false, srcDir: PATHS.dist, distDir: PATHS.dist
            })
    ))
    .pipe(gulp.dest(PATHS.dist));
}
// Recompile pages
function resetPages(done) {
  panini.refresh();
  done();
}

//================ CSS

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src(PATHS.scss_main_file)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(err => ({
        title: 'SCSS ERROR!', message: err.message
      }))
    }))
    .pipe(plugins.if(!PRODUCTION, plugins.sourcemaps.init()))
    .pipe(plugins.sass({})
    .on('error', plugins.sass.logError))
    .pipe(plugins.if(PRODUCTION, plugins.autoprefixer() ))
    .pipe(plugins.if(PRODUCTION, plugins.cssnano({ safe: true })))
    .pipe(plugins.if(!PRODUCTION, plugins.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
}

//================ JS

// Combine JavaScript into one file
// 1) Version with concatenation and minification
function javascript() {
  return gulp.src(PATHS.javascript)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(err => ({
        title: 'JS ERROR!', message: err.message
      }))
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('app.js'))
    .pipe(plugins.if(PRODUCTION, plugins.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe(plugins.if(!PRODUCTION, plugins.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js'));
}
// 2) Version with just copy all js files from src/js to dist/js
// function javascript() {
//     return gulp.src( PATHS.javascript )
//         .pipe(plugins.newer(PATHS.dist + '/assets/js'))//filter existent files
//         .pipe(gulp.dest(PATHS.dist + '/assets/js'));
// }


//================ IMAGES

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src(PATHS.images)
    //.pipe( plugins.newer(PATHS.dist + '/assets/img') )//filter existent files
    // .pipe( plugins.if(PRODUCTION, plugins.imagemin(
    //     [ //enable if you need it
    //         plugins.imagemin.gifsicle({interlaced: true}),
    //         plugins.imagemin.jpegtran({progressive: false}),
    //         plugins.imagemin.optipng({optimizationLevel: 3}),
    //     ]
    // )))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

//Sprites
//|options with PATHS may not work
//disabled by default, uncomment here and in "watch", and add to build task to enable
// function sprites() {
//     var spriteData =
//         gulp.src(PATHS.sprites + '*.png') //Sources of images to merge in sprite
//             .pipe(plugins.plumber({
//               errorHandler: plugins.notify.onError(err => ({
//                 title: 'SPRITES ERROR!',
//                 message: err.message
//               }))
//             }))
//             .pipe(spritesmith({
//                 imgName: 'sprite.png', //Name of sprite image
//                 cssName: '_sprites.scss', //file with styles of sprite
//                 imgPath: '../img/sprites/sprite.png?' + Date.now(), //path to place compiled sprite
//                 cssFormat: 'scss', //Format of file with sprite styles
//                 padding: 1,//space between images inside, restart 2 times after changing
//                 cssVarMap: function(sprite) {
//                     sprite.name = 'icon-' + sprite.name //Generate sprite name 'icon-' + name of the file
//                 }
//             }));
//     spriteData.img.pipe(gulp.dest('dist/assets/img/sprites/')); // Destination path to the sprite image
//     spriteData.css.pipe(gulp.dest('src/assets/scss/components')); // Destination to the scss file with sprite styles
//     return spriteData;
// }

//================ SERVER

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({ server: PATHS.dist, port: OPTIONS.port });
  done();
}
// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

//================

// Watch for changes to static assets, pages, Sass, and JavaScript
// |reload server when changing: static, html, scss, js, images, sprites, fonts
function watch() {
  gulp.watch(PATHS.assets, gulp.series(copy, reload) );//fonts, pure css from assets folder
  gulp.watch(PATHS.to_root, gulp.series(copyToRoot, reload) );//simple files for root
  gulp.watch(PATHS.images).on('all', gulp.series(images, reload));//images
  gulp.watch('src/pages/**/*.html').on('all', gulp.series(pages, reload));//html pages
  gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages, reload));//html layouts
  gulp.watch(PATHS.watch_styles).on('all', gulp.series(sass, reload));//scss
  gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(javascript, reload));//js
  //gulp.watch(PATHS.sprites + '**/*').on('all', gulp.series(sprites, reload));//sprites
}

//Public tasks
const build = gulp.series(clean, gulp.parallel( gulp.series( gulp.parallel(sass, javascript), pages ), images, copy, copyToRoot));
exports.build = build;
exports.default = gulp.series(build, server, watch);

//test


