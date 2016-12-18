# Cool frontend template

My template based on ZURB Template for sites
Gulp config provides these features:

- CSS: SCSS, UnCss, Autoprefixer, CSSNano, Sourcemap
- JS: Uglify, Concat, Babel, Sourcemap
- Pages: Panini (like Handlebars)
- Images: Imagemin
- Sprites: gulp.spritesmith
- Server: live-reload via browser-sync

Load settings from config.yml
There is a possibility to switch between Bootstrap3 and Foundation6 by commenting and uncommenting settings

## Install 

```bash
cd projectname
npm install
bower install
```
## Run

For development:
```bash
npm start
```
For production:
```bash
npm build run
```
Your finished site will be created in a folder called `dist`, viewable at this URL:

```
http://localhost:8000
```

