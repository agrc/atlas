# Running, Building, and Deployment Information

## Running for local development

- Duplicate the `.env` file and rename it as `.env.development.local` and update the properties with your data
- Execute `npm install` to grab dependencies
- Execute `npm start` to start a web server and view the website
- Execute `npm test` to run tests

## Building for production

- Execute `npm run build` to create an optimized production build

  _The files will be placed in `/build`_

- Execute `serve -s build` to view the website

## Deployment

- [ ] Semantically update `.env` property `REACT_APP_VERSION` and `package.json` version
- [ ] Update `public/changelog.html`
- [ ] Update the analytics code in `public/index.html`
- [ ] Verify all tests are passing (`npm test`)
- [ ] Run a build and test (`npm run build`)
- [ ] Create and populate `secrets.json` based on `secrets.sample.json`
- [ ] Deploy website (`grunt deploy-prod`)
- [ ] Create release commit (`git commit -m 'chore: Release vx.x.x`)
- [ ] Create tag (`git tag vx.x.x`)
- [ ] Push commits and tag to github (`git push origin && git push origin --tags`)
