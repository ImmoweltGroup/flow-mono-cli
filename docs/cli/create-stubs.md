# `flow-mono create-stubs`

Creates stubs for so called "in-direct" dependencies, this is useful if a package provides it's own typings out of the box and you don't want to suppress any errors from in-direct dependencies or even `Required module not found` errors.

#### Features

* Resolves packages of your mono-repo that have a dependency to `flow-typed` as well as a dependency to one of the whitelisted packages in your configuration.
* Resolves the in-direct dependencies of the iterated dependency and creates stubs for them.

#### Example

```sh
$ flow-mono create-stubs
```

#### Configuration

By default this command will not do anything since automatically stubbing all 2nd level dependencies is to error prone. Instead you need to whitelist the dependencies for which we should create stubs of it's in-direct dependencies. To do so just create a `.monoflowrc` or a `mono-flow` section in your repositories root `package.json`, paste in the example and adjust as you like!

```json
{
  "create-stubs": {
    "dependencies": ["immutable-js"]
  }
}
```

This will resolve all mono-repo packages that have `immutable-js` as a dependency, resolve `immutable-js` own dependencies and create stubs for them.
