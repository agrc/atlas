# atlas

## UGRC Web Mapping Application Template

[![Pull Request Events](https://github.com/agrc/atlas/actions/workflows/pull_request.yml/badge.svg)](https://github.com/agrc/atlas/actions/workflows/pull_request.yml)
[![Push Events](https://github.com/agrc/atlas/actions/workflows/push.yml/badge.svg)](https://github.com/agrc/atlas/actions/workflows/push.yml)

## To Use

### Step 1 - Use this template

Click the `Use this template` button to create a new repository from atlas

or

Checkout repository and install dependencies

```bash
git clone https://github.com/agrc/atlas.git
cd atlas
```

Duplicate the `.env` file and rename it as `.env.local` and update the properties with your data

Download all the dependencies

```bash
npm install
```

### Step 2 - Develop & Test

Execute `npm start` to start a web server and view the website

Open [`src/App.jsx`](src/App.jsx) to view the development version of the app.

Build an awesome app.

Run `npm test` to run the unit tests

Run `npm run cypress:run` to run the functional tests

Run `npm run format` to format the code

Run `npm run lint` to lint the code

### Step 3 - Optimize

Execute `npm run build` to create an optimized production build

_The files will be placed in `/dist`_

Execute `npm run preview` to view the website

### Step 4 - Deploy

One-time tasks:

- [ ] Update the analytics code in `index.html`

This website is tested and deployed with GitHub Actions.

### Contributing

[See our Contributing Guide](./CONTRIBUTING.md)
