# atlas

## AGRC JavaScript Project Boilerplate

[![Build Status](https://travis-ci.org/agrc/atlas.svg?branch=master)](https://travis-ci.org/agrc/atlas)

## To Use

### Step 1 - Boilerplate

```bash
git clone https://github.com/agrc/atlas.git
cd atlas
npm install
```

### Step 2 - Develop

Open [`src/App.js`](src/App.js) to view the development version of the app.

Build an awesome app.

### Step 3 - Optimize

Check out [run_build_deploy.md](run_build_deploy.md) to prepare to run `grunt build-stage` or `grunt build-prod`.

### Step 4 - Deploy

Create a `secrets.json` file using [`secrets.sample.json`](secrets.sample.json) as a template. Run `grunt deploy-stage` or `grunt deploy-prod` to deploy your app to the server.

## Tool Versions

See [`package.json`](package.json) for dependency versions.

## Notes

Before beginning development make sure to run:

```bash
npm install
```

to bring in all of the required dependencies.

A WASM MIME type that is used in the Esri JS API (geometry engine) is defined in [web.config](_src/web.config). This will cause a server error in IIS if you have the same type defined in a parent directory. If you experience this error you will need to remove one of the duplicate MIME type definitions.
