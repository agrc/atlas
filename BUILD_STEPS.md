For Single Page Apps
====================
- copy mxd's to hnas/serverprojects
- add analytics code
- _SpecRunner.html
- Bump app version number and update changelog
- Save new profiles/traffic.har file
- change apiKey in main.js from localhost to server
- run slurp_esri_modules.sh, if needed
- build.sh
- test in dist
- change apiKey in main.js back
- tag

For Embedded Widget Projects
============================
- copy mxd's to hnas/serverprojects
- add analytics code
- _SpecRunner.html
- Bump app version number and update changelog
- change apiKey in main.js from localhost to server
- run slurp_esri_modules.sh, if needed
- build.sh
- test in dist
- change server to point to url in dist/EmbeddedMapLoader.js
- push to server and test dist again
- change apiKey in main.js back
- change dist/EmbeddedMapLoader.js to point back to relative path
- tag