# React gallery 

```javascript 1.8
// todo
```

# Library development: 
## `yarn` Scripts
- `test` - _run unit tests_
- `test:cover` - _run unit tests with test coverage_
- `lint` - _check `eslint` and `prettier` rules_
- `lint:fix` - _autofix unmet `eslint` and `prettier` rules_
- `local-pack` - _create the `tgz` package locally to test consumers without publishing_
- `start` - _start the storybook server and automatically open in browser_
- `compile` - _standard typescript compile `tsc`_

Before each commit, `husky` and `lint-staged` will automatically lint your staged `ts, tsx, js, jsx` files.

# Configuration

## Circle CI
You need to configure one [environment variable](https://circleci.com/docs/2.0/env-vars/) in CircleCI, for publishing to NPM.
- `NPM_TOKEN`

## Zeit
You need to authorize [Zeit](https://zeit.co/github-setup) with your GitHub account to enable automatic deployments. Once configured, you can enable Zeit to deploy any repository that contains a `now.json` file.

## Dependabot (optional)
I recommend enabling [Dependabot](https://dependabot.com/) on this repository to keep your dependencies up to date. Each dependency update will be created as a PR, which will automatically validate via Circle CI and you can manually validate via Zeit.
