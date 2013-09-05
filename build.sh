#!/usr/bin/env bash

set -e

# Base directory for this entire project
BASEDIR=$(cd $(dirname $0) && pwd)

# Source directory for unbuilt code
SRCDIR="$BASEDIR/src"

# Directory containing dojo build utilities
TOOLSDIR="$SRCDIR/util/buildscripts"

# Destination directory for built code
DISTDIR="$BASEDIR/dist"

# Module ID of the main application package loader configuration
LOADERMID="app/run"

# Main application package loader configuration
LOADERCONF="$SRCDIR/$LOADERMID.js"

# Main application package build configuration
PROFILE="$BASEDIR/profiles/app.profile.js"

# HAR file of all traffic for app
HARFILE="$BASEDIR/profiles/traffic.har"

# Configuration over. Main application start up!

if [ ! -d "$TOOLSDIR" ]; then
  echo "Can't find Dojo build tools -- did you initialise submodules? (git submodule update --init --recursive)"
  exit 1
fi

echo "Building application with $PROFILE to $DISTDIR."
echo "$LOADERCONF"

echo -n "Cleaning old files..."
echo "$BASEDIR"
if [ -e "$DISTDIR/sftp-config.json" ]; then
  cp "$DISTDIR/sftp-config.json" "$BASEDIR"
fi
if [ -e "$DISTDIR/sftp-config-alt.json" ]; then
  cp "$DISTDIR/sftp-config-alt.json" "$BASEDIR"
fi
if [ -e "$DISTDIR/EmbeddedMapLoader.js" ]; then
  cp "$DISTDIR/EmbeddedMapLoader.js" "$BASEDIR"
fi
rm -rf "$DISTDIR"
echo " Done"

cd "$TOOLSDIR"

if which node >/dev/null; then
  ulimit -n 1024
  node ../../dojo/dojo.js load=build --require "$LOADERCONF" --profile "$PROFILE" --releaseDir "$DISTDIR" $@
elif which java >/dev/null; then
  java -Xms256m -Xmx256m  -cp ../shrinksafe/js.jar:../closureCompiler/compiler.jar:../shrinksafe/shrinksafe.jar org.mozilla.javascript.tools.shell.Main  ../../dojo/dojo.js baseUrl=../../dojo load=build --require "$LOADERCONF" --profile "$PROFILE" --releaseDir "$DISTDIR" $@
else
  echo "Need node.js or Java to build!"
  exit 1
fi

cd "$BASEDIR"

LOADERMID=${LOADERMID//\//\\\/}

# Copy & minify index.html to dist
echo 'copying index.html'
cat "$SRCDIR/index.html" | tr '\n' ' ' | \
perl -pe "
  s/<script data-dojo.*?run.js' defer><\/script>/<script src='dojo\/dojo\.js' data-dojo-config=\"deps:['app\/run']\"><\/script>/;
  s/\s+/ /g;                                 # Collapse white-space" > "$DISTDIR/index.html"

echo 'copying ChangeLog.html'
cat "$SRCDIR/ChangeLog.html" | tr '\n' ' ' | \
perl -pe "
  s/<\!--.*?-->//g;                          # Strip comments
  s/\s+/ /g;                                 # Collapse white-space" > "$DISTDIR/ChangeLog.html"

echo "removing un-needed dojo files"
cd "$DISTDIR"
# rm -rf "dojox" need to leave for gfx renderers which cannot be included in the build
# see: http://dojotoolkit.org/reference-guide/1.9/dojox/gfx.html#id53
# rm -rf "dijit"
find . -name *.uncompressed.js -exec rm '{}' ';'
find . -name *.consoleStripped.js -exec rm '{}' ';'

if [ -e "$BASEDIR/sftp-config.json" ]; then
  mv "$BASEDIR/sftp-config.json" "$DISTDIR"
fi
if [ -e "$BASEDIR/sftp-config-alt.json" ]; then
  mv "$BASEDIR/sftp-config-alt.json" "$DISTDIR"
fi
if [ -e "$BASEDIR/EmbeddedMapLoader.js" ]; then
  mv "$BASEDIR/EmbeddedMapLoader.js" "$DISTDIR"
fi

echo "Build complete"