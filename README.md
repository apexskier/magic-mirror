# Basic Website

This repo contains the template for a basic web project using Gulp, SASS, and
ES6.

Run `npm install` to get ready, then `gulp` to start working. The site will be
built in the `dst` directory. Put your SASS in `src/styles` and your javascript
in `src/scripts`.

Not finished yet, media's not handled completely and javascript dependancies
aren't added automatically.

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
