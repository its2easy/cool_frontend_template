# Cool frontend template

Template to compile frontend  
Gulp config provides these features:

- CSS: SCSS, UnCss, Autoprefixer, CSSNano, Sourcemap
- JS: Uglify, Concat, Babel, Sourcemap
- Pages: Panini (Handlebars syntax)
- Images: Imagemin
- Sprites: gulp.spritesmith
- Server: live-reload via browser-sync
 
There are the possibility to use on of these frameworks:
* Foundation6
* Bootstrap3
* Bootstrap4

Before start change the settings to use one of them (default *Bootstrap 4*)
* In **bower.json** delete unusual libraries from dependencies section
* In **config.yml** comment and uncomment settings in sections:
    * COMPATIBILITY
    * UNCSS_OPTIONS
    * sass
    * js
* In src/assets/scss/**app.scss** choose necessary option in "Vendors imports" block

Png images to make a sprite should be in *src/assets/img/sprites/*  
Image like *circle.png* can be used as: `@include sprite( $icon-circle );`  
List of javascript files placed in **config.yml**  
All of scss imports are in **app.scss**, vendor settings and imports are in *src/assets/scss/vendor*  
Source files of the frameworks and libraries are in *bower_components* folder


## Install 

```bash
cd projectname-folder
npm install
bower install
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

