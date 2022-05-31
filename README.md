[![EdgePetrol](https://circleci.com/gh/EdgePetrol/danger-plugin-jest-codecov.svg?style=shield)](https://app.circleci.com/pipelines/github/EdgePetrol/danger-plugin-jest-codecov)
![EdgePetrol](https://github.com/EdgePetrol/coverage/blob/master/danger-plugin-jest-codecov/master/badge.svg)
[![npm version](https://badge.fury.io/js/danger-plugin-jest-codecov.svg)](https://badge.fury.io/js/danger-plugin-jest-codecov)

# danger-plugin-jest-codecov

> Similar to codecov bot, it will print the code coverage difference on each PR

## Usage

Install:

```sh
yarn add danger-plugin-jest-codecov --dev
```

At a glance:

```js
// dangerfile.js
import jestCodecov from 'danger-plugin-jest-codecov'

jestCodecov('current_url_to_lcov_index_html', 'desired_branch_url_to_lcov_index_html')
```
## Changelog

See the GitHub [release history](https://github.com/EdgePetrol/danger-plugin-jest-codecov/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
