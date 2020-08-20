# danger-plugin-jest-codecov

[![Build Status](https://circleci.com/gh/EdgePetrol/danger-plugin-jest-codecov.svg?style=shield)](https://app.circleci.com/pipelines/github/EdgePetrol/danger-plugin-jest-codecov)
[![npm version](https://badge.fury.io/js/danger-plugin-jest-codecov.svg)](https://badge.fury.io/js/danger-plugin-jest-codecov)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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

See the GitHub [release history](https://github.com/guiferrpereira/danger-plugin-jest-codecov/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
