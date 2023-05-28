const { src, dest, watch, series, parallel } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const htmlMinify = require("gulp-html-minifier-terser");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const webp = require("gulp-webp");
const newer = require("gulp-newer");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const replace = require("gulp-replace");

function fonts() {
  return src("src/fonts/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(src("src/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("src/fonts"));
}

async function images() {
  const imagemin = await import("gulp-imagemin");

  return src("src/images-src/**/*", "!src/images-src/**/*.svg")
    .pipe(newer("src/images"))
    .pipe(imagemin.default())
    .pipe(webp())
    .pipe(dest("src/images"));
}

function styles() {
  return src("src/scss/style.scss", { sourcemaps: true })
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(postcss())
    .pipe(autoprefixer())
    .pipe(concat("style.min.css"))
    .pipe(dest("src/css", { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("src/js/main.js", { sourcemaps: true })
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js", { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

function doHtml() {
  return src("src/pages/index.html")
    .pipe(htmlMinify({ collapseWhitespace: true }))
    .pipe(dest("src"))
    .pipe(browserSync.stream());
}

function doReplace() {
  return src("dist/index.html")
    .pipe(replace('href="css/style.min.css"', 'href="dist/css/style.min.css"'))
    .pipe(replace('href="css/reset.css"', 'href="dist/css/reset.css"'))
    .pipe(replace('src="js/main.min.js"', 'src="dist/js/main.min.js"'))
    .pipe(replace(/(src|href)=["']\.\.\/images/g, '$1="dist/images'))
    .pipe(dest("."));
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });

  watch(["src/scss/*.scss"], styles);
  watch(["src/js/main.js"], scripts);
  watch(["src/pages/index.html"], doHtml);
}

function cleanDist() {
  return src("dist").pipe(clean());
}

//      "src/**/*.html" => "src/index.html",
function building() {
  return src(
    [
      "src/css/*.css",
      "src/js/main.min.js",
      "src/index.html",
      "src/images/**/*.*",
      "src/fonts/*.woff",
      "src/fonts/*.woff2",
    ],
    {
      base: "src",
    }
  ).pipe(dest("dist"));
}

exports.images = images;
exports.doHtml = doHtml;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.watching = watching;
exports.building = building;
exports.cleanDist = cleanDist;
exports.doReplace = doReplace;

exports.default = parallel(images, fonts, styles, scripts, doHtml, watching);
exports.build = series(cleanDist, building, doReplace);

// exports.build = series(
//   cleanDist,
//   parallel(styles, scripts, images, fonts, doHtml)
// );
// exports.dev = series(watching, building, doReplace);
