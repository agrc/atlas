For Single Page Apps
====================
- copy mxd's to `//HNAS/ArcGISServer/serverprojects`
- add analytics code
- update api keys in `config.js`, if needed
- `grunt bump-only:[major|minor|patch]`
- `grunt build-prod`
- test `/dist`
- update changelog
- `grunt bump-commit`
- `grunt deploy-prod`
- `git push origin && git push origin --tags `
