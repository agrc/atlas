BASEDIR=$(cd $(dirname $0) && pwd)
SRCDIR="$BASEDIR/src"

echo "slurping esri modules"
wget -xi "$BASEDIR/profiles/esri_modules_3.8.txt" --base=http://js.arcgis.com/3.8amd/js/esri/
rsync -avh "js.arcgis.com/3.8amd/js/esri" "src/"
rm -rf "serverapi.arcgisonline.com"

echo "processing esri modules"
cd "$SRCDIR/esri"
FILES=$(find .)
for f in $FILES
do
  perl -pi -e "
    m/(define\()(\".*\")(.split\(\" \"\))/;
    (my \$new = \$2) =~ s/ /\"\,\"/g;
    s/(define\()(\".*\")(.split\(\" \"\))/\$1\[\$new\]/;
    s/\/dojo\/dijit\/themes/\/dijit\/themes/g;
    s/\/dojo\/dojox\/grid\/resources\/images/\/dojox\/grid\/resources\/images/g;
    s/\/dojo\/dojo\/resources\/images/\/dojo\/resources\/images/g;
    " $f
done
perl -pi -e "
    s/\,ar:1.*zh-cn\":1//;
    " "$SRCDIR/esri/nls/jsapi.js"

cd "$BASEDIR"
rm -rf "js.arcgis.com"