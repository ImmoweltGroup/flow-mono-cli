<img alt="flow-mono-cli" src="https://user-images.githubusercontent.com/1557092/32433811-8ae21ef0-c2dc-11e7-9e5d-9757165427e0.png" width="425">

# flow-mono-cli

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/flow-mono-cli.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/flow-mono-cli)
[![Dependency Status](https://david-dm.org/ImmoweltGroup/flow-mono-cli.svg)](https://david-dm.org/ImmoweltGroup/flow-mono-cli)
[![devDependency Status](https://david-dm.org/ImmoweltGroup/flow-mono-cli/dev-status.svg)](https://david-dm.org/ImmoweltGroup/flow-mono-cli#info=devDependencies&view=table)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

`flow-mono-cli` is a command line interface that aims to [solve](https://github.com/facebook/flow/issues/4738) [a](https://github.com/facebook/flow/issues/5107) [few](https://github.com/flowtype/flow-typed/issues/1391) [issues](https://github.com/lerna/lerna/issues/891) [while](https://github.com/facebook/flow/issues/869) working with flow typed codebases in a mono-repo.

It provides a set of commands that we found to be very useful *if you want your mono-repo packages to have their own flow instances*. We do not intend to replace existing packages and furthermore we find it to be of importance that these issues are getting fixed at their respective packages but in the meantime a separate CLI was the fastest and best option we found.

## Features

* Creates symlinks for flow to be able to resolve dependencies which where installed/hoisted into the root `node_modules` of your mono-repo into each packages `node_modules`.
* Smart resolve mechanism of mono-repo packages with a dependency to `flow-bin`, based on the `workspaces` config in your root `package.json`.
* Keeps your `flow-bin` and `flow-typed` versions in sync across your mono-repo packages.
* Maintains a single or fallback `.flowconfig` across all packages.
* Creates flow-typed stubs for in-direct dependencies (dependencies of dependencies).
* Configurable via a `.flowmonorc` or `flow-mono` property in your mono-repo's root `package.json`.

## Installation
```sh
$ npm install flow-mono-cli --save-dev
```

or

```sh
$ yarn add flow-mono-cli --dev
```

afterwards make sure that you've got your workspaces configured in the root `package.json`, e.g.

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

## Commands and Documentation

* [Introduction](/docs/introduction/README.md)
* [`flow-mono create-symlinks`](/docs/cli/create-symlinks.md)
* [`flow-mono install-types`](/docs/cli/install-types.md)
* [`flow-mono create-stubs`](/docs/cli/create-stubs.md)
* [`flow-mono align-versions`](/docs/cli/align-versions.md)

## Contributing
See the `CONTRIBUTING.md` file at the root of the repository.

## Licensing
See the `LICENSE` file at the root of the repository.
