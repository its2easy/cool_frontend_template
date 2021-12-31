# Frontend template
for projects without the webpack.

Gulp config provides these features:

- CSS: SCSS, Autoprefixer, CSSNano, Sourcemap
- JS: Terser, Concat, Sourcemap
- Pages: Panini (Handlebars syntax)
- Server: live-reload via browser-sync
 
Pure css  files can be placed in **src/css/** to avoid compilation

List of javascript files to compile placed in PATHS.javascript, to disable js compilation 
uncomment version 2 javascript function, and second "javascript" in PATHS

All of scss imports are in **app.scss**, all vendor imports are in *src/assets/scss/vendor.scss*  


## Install 

```bash
cd projectname-folder
npm install
```

In case of errors during the installation try to install this 
[https://github.com/nodejs/node-gyp](https://github.com/nodejs/node-gyp) 
and repeat. Tested with node v10.4.1/

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

