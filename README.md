AGRC JavaScript Project Boilerplate
===================================

Based heavily upon: [https://github.com/csnover/dojo-boilerplate](https://github.com/csnover/dojo-boilerplate)

To Use
======

### Step 1 - Boilerplate

```
git clone https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate.git --recursive
cd AGRCJavaScriptProjectBoilerPlate
npm install
```

### Step 2 - Develop

Open `src/index.html` to view the development version of the app.

Build an awesome app.

Run `grunt` to automatically lint your files and run unit tests (see _SpecRunner.html for unit tests).

### Step 3 - Optimize

Check out [BUILD_STEPS.md](https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate/blob/master/BUILD_STEPS.md) to prepare to run `build.sh`. This will use the [dojo build system](http://dojotoolkit.org/reference-guide/build/) to create an optimized version of your app in the `dist` directory that you can then upload to your server.

Tool Versions
============

[Dojo](http://dojotoolkit.org/): 1.8.3

[ESRI JS API](http://js.arcgis.com/): 3.6

[Grunt](http://gruntjs.com/): 0.4.1 (plugins can be found in `package.json`)

[Jasmine](http://pivotal.github.com/jasmine/): 1.3.1

[Bootstrap](http://getbootstrap.com/): 3.0.0

Notes
=====

The build script uses a special AMD build of the ESRI api to get all modules into a single built layer file (`dojo/dojo.js`).

`dojo`, [`agrc`](https://github.com/agrc/agrc.widgets), and [`ijit`](https://github.com/agrc/agrc-ijit) are included via git submodules so make sure that you clone the repository like this:

```
git clone --recursive
```

Or do this after cloning:

```
git submodule update --init --recursive
```