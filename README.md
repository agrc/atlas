AGRC JavaScript Project Boilerplate
===================================

Based heavily upon: [https://github.com/csnover/dojo-boilerplate](https://github.com/csnover/dojo-boilerplate)

Dojo is include via git submodules so make sure that you run `git submodule update --init --recursive` after cloning.

I wasn't able to load ESRI modules without loading their layer file. So I'm building all of my modules with esri excludes and loading that as a separate layer file in addition to the ESRI layer file.

