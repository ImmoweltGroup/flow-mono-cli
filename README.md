![flow-mono-cli](https://user-images.githubusercontent.com/1557092/32374901-e2682dfc-c09f-11e7-8607-ba80619f10c7.png)

# flow-mono-cli

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Greenkeeper badge](https://badges.greenkeeper.io/ImmoweltGroup/flow-mono-cli.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/flow-mono-cli.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/flow-mono-cli)
[![Dependency Status](https://david-dm.org/ImmoweltGroup/flow-mono-cli.svg)](https://david-dm.org/ImmoweltGroup/flow-mono-cli)
[![devDependency Status](https://david-dm.org/ImmoweltGroup/flow-mono-cli/dev-status.svg)](https://david-dm.org/ImmoweltGroup/flow-mono-cli#info=devDependencies&view=table)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

`flow-mono-cli` is a command line interface that aims to [solve](https://github.com/facebook/flow/issues/4738) [a](https://github.com/facebook/flow/issues/5107) [few](https://github.com/flowtype/flow-typed/issues/1391) [issues](https://github.com/lerna/lerna/issues/891) [while](https://github.com/facebook/flow/issues/869) working with flow typed codebases in a mono-repo.

It provides a set of commands that we found to be very useful *if you want your mono-repo packages to have their own flow instances*. We do not intend to replace existing packages and furthermore we find it to be of importance that these issues are getting fixed at their respective packages but in the meantime a separate CLI was the fastest and best option we found.

## Features

* Keeps your `flow-bin` and `flow-typed` versions in sync across your mono-repo packages.
* Creates necessary symlinks for dependencies which where installed into the root `node_modules` of your mono-repo into each packages `node_modules`.
* Maintain a single or fallback `.flowconfig` across all packages.
* Create flow-typed stubs for dependencies of dependencies.
* Configurable via a `.monoflowrc` or `mono-flow` property in your mono-repo's root `package.json`.

## Install

```sh
$ npm install flow-mono-cli flow-bin flow-typed --save-dev
```

or

```sh
$ yarn add flow-mono-cli flow-bin flow-typed --dev
```

## Commands and Documentation

* [`flow-mono create-symlinks`](/docs/cli/create-symlinks.md)
* [`flow-mono install-types`](/docs/cli/install-types.md)
* [`flow-mono create-stubs`](/docs/cli/create-stubs.md)
* [`flow-mono align-versions`](/docs/cli/align-versions.md)

## Contributing
See the `CONTRIBUTING.md` file at the root of the repository.

## Licensing
See the `LICENSE` file at the root of the repository.
