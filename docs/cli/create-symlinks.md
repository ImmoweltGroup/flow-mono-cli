# `flow-mono create-symlinks [flowconfig-path]`

Ever had errors like `Required module not found` for dependencies which where located in the root `node_modules` of your mono-repo? Ever wanted to maintain a fallback or even a singleton `.flowconfig` in your mono-repo? This command is your new best friend!

#### Features

* Resolves packages of your mono-repo that have a dependency to `flow-bin`.
* Creates symlinks for all dependencies into the root `node_modules` of your mono-repo.
* Creates symlinks to the provided `.flowconfig` path if a package does not hold it's own `.flowconfig` file.

#### Example

```sh
$ flow-mono create-symlinks ./build/.flowconfig
```

#### Configuration

Additionally you can specify a blacklist of packages that should be ignored entirely from being symlinked. To do so just create a `.monoflowrc` or a `mono-flow` section in your repositories root `package.json`, paste in the example and adjust as you like!

```json
{
  "create-symlinks": {
    "ignore": ["eslint", "jest"]
  }
}
```

This will ignore all dependencies that include either `jest` or `eslint` in their package names.
