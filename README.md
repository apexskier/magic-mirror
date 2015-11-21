# Basic Website

This repo contains the template for a basic web project using Gulp, SASS, and
ES6.

Run `npm install` to get ready, then `gulp` to start working. The site will be
built in the `dst` directory. Put your SASS in `src/styles` and your javascript
in `src/scripts`.

Gulp auto builds as you code. Any scripts or styles generated will
automatically be inserted into your html files.

## Styles

Styles are written in [SCSS](http://sass-lang.com/). A super basic reset file
is provided. Gulp will automatically compile, prefix, and minify.

A csscomb config is provided. Run `csscomb src/styles` to reformat your scss
nicely.

## Scripts

Scripts can be written using ES6. They will be compiled, combined, and uglified
into a file called `index.js`.

## [GitHub Pages](https://pages.github.com)

I originally built this for use with github pages. My goal was to avoid putting
all the build tools in the actual website or checking built content into my
working directory. I work on a branch called `gh-pages-dev`, running `gulp`
before starting any coding. When I want to publish my website, I run
`./ghpages_publish.sh`, and the site is built, commited, and pushed on the
`gh-pages` branch. The site is then available at
`https://<username>.github.io/<repo>`.

You must create the branch `gh-pages` on the remote if it doesn't
exist.
