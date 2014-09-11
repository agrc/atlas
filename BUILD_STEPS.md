For Single Page Apps
====================
- copy mxd's to `//(53)/ArcGISServer/serverprojects`
- add analytics code
- update api keys in `config.js`, if needed
- `grunt bump`
- `grunt build-prod -v -f`
- test in `/dist`
- `grunt deploy-prod -v`