# Cool frontend template

Template to compile frontend  
Gulp config provides these features:

- CSS: SCSS, Autoprefixer, CSSNano, Sourcemap
- JS: Uglify, Concat, Babel(for gulpfile now), Sourcemap
- Pages: Panini (Handlebars syntax)
- Images: Imagemin (disabled by default)
- Sprites: gulp.spritesmith
- Server: live-reload via browser-sync
 

In **config.yml** list of js files if using concat and minifying

Pure css  files can be placed in **src/css/** to avoid compilation


Png images to make a sprite should be in *src/assets/img/sprites/*  
Image like *circle.png* can be used as: `@include sprite( $icon-circle );`  
List of javascript files placed in **config.yml**  
All of scss imports are in **app.scss**, all vendor imports are in *src/assets/scss/vendor.scss*  


## Install 

```bash
cd projectname-folder
npm install
```
## Run

For development:
```bash
npm start
```
For production (without server and minified):
```bash
npm run build
```
Your finished site will be created in the folder `dist`, viewable at this URL:

```
http://localhost:8000
```

