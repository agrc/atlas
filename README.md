# atlas

## AGRC JavaScript Project Boilerplate

[![Build Status](https://travis-ci.com/agrc/atlas.svg?branch=master)](https://travis-ci.com/agrc/atlas)

## To Use

### Step 1 - Boilerplate

Checkout repository and install dependencies

```bash
git clone https://github.com/agrc/atlas.git
cd atlas
npm install
```

Duplicate the `.env-cmdrc.template.json` file and rename it as `.env-cmdrc.json` and update the properties with your data

### Step 2 - Develop & Test

Execute `npm start` to start a web server and view the website

Open [`src/App.js`](src/App.js) to view the development version of the app.

Build an awesome app.

Execute `npm test` to run tests

### Step 3 - Optimize

Execute `npm run build:prod` to create an optimized production build

_The files will be placed in `/build`_

Execute `serve -s build` to view the website

### Step 4 - Deploy

One-time tasks:

- [ ] Update the analytics code in `public/index.html`
- [ ] Create and populate `.env-cmdrc.json` based on `.env-cmdrc.template.json`

Tasks to be completed for each release:

- [ ] Semantically update the `package.json` version
- [ ] Update `public/changelog.html`
- [ ] Verify all tests are passing (`npm test`)
- [ ] Run a build and test (`npm run build:prod`)
- [ ] Deploy website (`npm run deploy:prod`)
- [ ] Create release commit (`git commit -m 'chore: Release vx.x.x`)
- [ ] Create tag (`git tag vx.x.x`)
- [ ] Push commits and tag to github (`git push origin && git push origin --tags`)

## Notes

A WASM MIME type that is used in the Esri JS API (geometry engine) is defined in [web.config](_src/web.config). This will cause a server error in IIS if you have the same type defined in a parent directory. If you experience this error you will need to remove one of the duplicate MIME type definitions.
