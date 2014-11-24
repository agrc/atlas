[![Build Status](https://travis-ci.org/agrc/AGRCJavaScriptProjectBoilerPlate.svg?branch=master)](https://travis-ci.org/agrc/AGRCJavaScriptProjectBoilerPlate)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/stdavis.svg)](https://saucelabs.com/u/stdavis)
AGRC JavaScript Project Boilerplate
===================================

Based heavily upon: [https://github.com/csnover/dojo-boilerplate](https://github.com/csnover/dojo-boilerplate)

To Use
======

### Step 1 - Boilerplate

```
git clone https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate.git
cd AGRCJavaScriptProjectBoilerPlate
npm install
```

### Step 2 - Develop

Open `src/index.html` to view the development version of the app.

Build an awesome app.

Run `grunt` to automatically lint your files and run unit tests (see `_SpecRunner.html` for unit tests).

### Step 3 - Optimize

Check out [BUILD_STEPS.md](https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate/blob/master/BUILD_STEPS.md) to prepare to run `build.sh`. This will use the [dojo build system](http://dojotoolkit.org/reference-guide/build/) to create an optimized version of your app in the `dist` directory that you can then upload to your server.

Tool Versions
============

See `bower.json` for dependency versions.

Notes
=====

The build script uses a special AMD build of the ESRI api to get all modules into a single built layer file (`dojo/dojo.js`).

Before beginning development make sure to run:
```
bower install
npm install
```
to bring in all required dependencies.
