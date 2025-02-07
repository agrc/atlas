# Atlas

## UGRC Web Mapping Application Template

[![Pull Request Events](https://github.com/agrc/atlas/actions/workflows/pull_request.yml/badge.svg)](https://github.com/agrc/atlas/actions/workflows/pull_request.yml)
[![Push Events](https://github.com/agrc/atlas/actions/workflows/push.yml/badge.svg)](https://github.com/agrc/atlas/actions/workflows/push.yml)

## To Use

### Step 1 - Use this template

Click the `Use this template` button to create a new repository from atlas or checkout the repository

```bash
git clone https://github.com/agrc/atlas.git
cd atlas
```

Duplicate the `.env` file and rename it as `.env.local` to add your local secrets.

Install the project dependencies

```bash
pnpm install
```

### Step 2 - Develop and Test

Run `pnpm start` to start a web server and view the website

Open [`src/App.jsx`](src/App.jsx) to view the development version of the app.

Build an awesome app.

Run `pnpm test` to run the unit tests

Run `pnpm run format` to format the code

Run `pnpm run lint` to lint the code

### Step 3 - Optimize

Execute `pnpm run build` to create an optimized production build

_The files will be placed in `/dist`_

Execute `pnpm run preview` to view the built website

### Step 4 - Deploy

This website is tested and deployed with GitHub Actions.

### Contributing

[See our Contributing Guide](./CONTRIBUTING.md)

## Attribution

This project was developed with the assistance of [GitHub Copilot](https://github.com/features/copilot).
