[![Build Status](https://travis-ci.org/agrc/AGRCJavaScriptProjectBoilerPlate.svg?branch=master)](https://travis-ci.org/agrc/AGRCJavaScriptProjectBoilerPlate)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/agrc.svg)](https://saucelabs.com/u/agrc)
AGRC JavaScript Project Boilerplate
===================================

Dojo config based heavily upon: [https://github.com/csnover/dojo-boilerplate](https://github.com/csnover/dojo-boilerplate)

# To Use

## Step 1 - Boilerplate

```
git clone https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate.git
cd AGRCJavaScriptProjectBoilerPlate
npm install
bower install
```

## Step 2 - Develop

Open [`src/index.html`](src/index.html) to view the development version of the app.

Build an awesome app.

Run [`grunt`](http://gruntjs.com/) to automatically lint your files and run unit tests (see `_SpecRunner.html` for unit tests).

## Step 3 - Optimize

Check out [BUILD_STEPS.md](https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate/blob/master/BUILD_STEPS.md) to prepare to run `grunt build-stage` or `grunt build-prod`. This will use the [dojo build system](http://dojotoolkit.org/reference-guide/build/) to create an optimized version of your app in the `dist` directory that you can then upload to your server.

## Step 4 - Deploy

Create a `secrets.json` file using [`secrets.json.sample`](secrets.json.sample) as a template. Run `grunt deploy-stage` or `grunt deploy-prod` to deploy your app to the server.

# Tool Versions

See [`bower.json`](bower.json) and [`package.json`](package.json) for dependency versions.

# Notes

The build script uses a special AMD build of the ESRI api to get all modules into a single built layer file (`dojo/dojo.js`).

Before beginning development make sure to run:
```
bower install
npm install
```
to bring in all required dependencies.

An SVG MIME type that is used in this app is defined in [web.config](web.config). This will cause a server error in IIS if you have the same type defined in a parent directory. If you experience this error you will need to remove one of the duplicate MIME type definitions.
