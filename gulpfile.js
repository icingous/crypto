"use strict";

const gulp = require("gulp"),
  browserSync = require("browser-sync"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  htmlmin = require("gulp-htmlmin"),
  rename = require("gulp-rename"),
  cssnano = require("gulp-cssnano"),
  plumber = require("gulp-plumber"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  stylelint = require("gulp-stylelint"),
  babel = require("gulp-babel"),
  sequence = require("gulp4-run-sequence"),
  // svgstore = require("gulp-svgstore"),
  sass = require("gulp-sass")(require("sass"));

gulp.task("html", () =>
  gulp
    .src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }).pipe(gulp.dest("./build")))
);

gulp.task("styles", () =>
  gulp
    .src("./src/sass/**/*.scss")
    .pipe(plumber())
    .pipe(
      stylelint({
        reporters: [{ formatter: "string", console: true }],
      })
    )
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("./build/css"))
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream())
);

// gulp.task("svg-sprite", () =>
//   gulp
//     .src("./src/img/sprite/**/*.svg")
//     .pipe(
//       svgstore({
//         inlineSvg: true
//       })
//     )
//     .pipe(rename("sprite.svg"))
//     .pipe(gulp.dest("./build/img"))
// );

gulp.task("images", async (done) => {
  const {
    default: imagemin,
    mozjpeg,
    optipng,
    svgo,
  } = await import("gulp-imagemin");

  gulp
    .src("./src/img/**/*.{png,jpg,jpeg,svg}", { encoding: false })
    .pipe(
      imagemin([
        mozjpeg({ quality: 75, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: "removeViewBox",
              active: true,
            },
            {
              name: "cleanupIDs",
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest("./build/img"));
  done();
});

gulp.task("scripts", () =>
  gulp
    .src("./src/js/*.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./build/js"))
);

gulp.task("fonts", () =>
  gulp.src("./src/fonts/**/*.{woff,woff2,ttf}").pipe(gulp.dest("./build/fonts"))
);

gulp.task("watch", () => {
  gulp
    .watch("./src/*.html", gulp.series("html"))
    .on("change", browserSync.reload);
  gulp
    .watch("./src/sass/*.scss", gulp.series("styles"))
    .on("change", browserSync.reload);
  gulp
    .watch("./src/js/*.js", gulp.series("scripts"))
    .on("change", browserSync.reload);
});

gulp.task("serve", async (done) => {
  browserSync.init({
    server: "./build",
    notify: false,
    cors: true,
    ui: false,
  });
  done();
});

gulp.task("reload", () => {
  browserSync.reload();
});

gulp.task("del:build", async (done) => {
  const { deleteSync } = await import("del");
  deleteSync(["./build"]);
  done();
});

gulp.task("build", async (done) => {
  await sequence("del:build", "html", "images", "fonts", "styles", "scripts");
  done();
});

gulp.task("build-dev", () => sequence("html", "fonts", "styles", "scripts"));

gulp.task("start", async (done) => {
  await sequence("build", "serve", "watch", "reload");
  done();
});

gulp.task("start-dev", () => sequence("build-dev", "serve", "watch"));
