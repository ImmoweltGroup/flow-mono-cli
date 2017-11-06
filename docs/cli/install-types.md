# `flow-mono install-types [...flow-typed install options]`

Updates your local `flow-typed` cache and does a parallel `flow-typed install` in all of your packages.

#### Features

* Resolves packages of your mono-repo that have a dependency to `flow-typed`.
* Updates your `flow-typed` cache.
* Installs typings from the `flow-typed` repository into your mono-repo packages.
* Supports argument propagation to the `flow-typed install` commands.

#### Example

```sh
$ flow-mono install-types --ignoreDeps=peer --overwrite
```

#### Options and Arguments

All given options are being propagated to each `flow-typed intall` child process in the packages.
