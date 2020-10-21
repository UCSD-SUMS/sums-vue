# The New Reusable SUMS Website

See the GitHub hosted copy [here](https://ucsd-sums.github.io/sums-vue/).

To save time when creating new pages, the SUMS website is transitioning from a HTML/Bootstrap/Bash/Pandoc amalgamation to a statically generated [VuePress](https://vuepress.vuejs.org/) site.
This repository is a testing ground for that new site.

To use this repository, you must have [NodeJS](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed.
There are only a few commands to know:

```bash
yarn dev
# build an in-memory copy of the site
# serve it on 0.0.0.0:8000
# watch for file changes
# many kinds of file changes require a
# full restart of this command

yarn build
# build the static vuepress site and places it in ./docs

yarn serve
# serve the static site currently in ./docs
# serve it on 127.0.0.1:8000

yarn test
# perform yarn build, then yarn serve

yarn github
# perform yarn build but with a GitHub Pages compatible base
# this should be used to build the project before
# committing anything from ./docs to GitHub
```

## Extra Utilities

There are [additional scripts](utils/README.md) included in this repository.
They perform several processes to make the Tech Chair's life easier.
They also require a few more dependencies (described in the previously linked readme).
