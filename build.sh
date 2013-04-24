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

# Configuration over. Main application start up!

if [ ! -d "$TOOLSDIR" ]; then
  echo "Can't find Dojo build tools -- did you initialise submodules? (git submodule update --init --recursive)"
  exit 1
fi

echo "Building application with $PROFILE to $DISTDIR."
echo "$LOADERCONF"

echo -n "Cleaning old files..."
if [ -d "$DISTDIR/sftp-config.json" ]; then
  cp "$DISTDIR/sftp-config.json" "$BASEDIR"
  rm -rf "$DISTDIR"
fi
if [ -d "$DISTDIR/sftp-config-alt.json" ]; then
  cp "$DISTDIR/sftp-config-alt.json" "$BASEDIR"
  rm -rf "$DISTDIR"
fi
rm -rf "$DISTDIR"
echo " Done"

cd "$TOOLSDIR"

if which node >/dev/null; then
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
  s/<\!--.*?-->//g;                          # Strip comments
  s/isDebug: *1/deps:[\"$LOADERMID\"]/;      # Remove isDebug
  s/\s+/ /g;                                 # Collapse white-space" > "$DISTDIR/index.html"

echo 'copying ChangeLog.html'
cat "$SRCDIR/ChangeLog.html" | tr '\n' ' ' | \
perl -pe "
  s/<\!--.*?-->//g;                          # Strip comments
  s/\s+/ /g;                                 # Collapse white-space" > "$DISTDIR/ChangeLog.html"

echo "removing un-needed dojo files"
cd "$DISTDIR"
rm -rf "dojo"
rm -rf "dojox"
rm -rf "dijit"
find . -name *.uncompressed.js -exec rm '{}' ';'
find . -name *.consoleStripped.js -exec rm '{}' ';'

if [ -d "$BASEDIR/sftp-config.json" ]; then
  mv "$BASEDIR/sftp-config.json" "$DISTDIR"
fi
if [ -d "$BASEDIR/sftp-config-alt.json" ]; then
  mv "$BASEDIR/sftp-config-alt.json" "$DISTDIR"
fi

echo "Build complete"