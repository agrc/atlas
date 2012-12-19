AGRC JavaScript Project Boilerplate
===================================

Based heavily upon: [https://github.com/csnover/dojo-boilerplate](https://github.com/csnover/dojo-boilerplate)

Dojo is include via git submodules so make sure that you run:

```
git submodule update --init --recursive
```

after cloning.

I wasn't able to load ESRI modules without loading their layer file. So I'm building all of my modules with esri excludes and loading that as a separate layer file in addition to the ESRI layer file.

To Use
======

### Step 1 - Get the code

```
git clone https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate.git
cd AGRCJavaScriptProjectBoilerPlate
git submodule update --init --recursive
```

### Step 2 - Build something awesome

Open `src/index.html` to view the development version of the app.

Build an awesome app.

### Step 3 - Optimize

Before pushing to a server, run `build.sh`. This will use the dojo build system to create an optimized version of your app in the `dist` directory that you can then upload to your server.