# `flow-mono align-versions`

Compares all mono-repo packages dependencies of `flow-bin` and `flow-typed` to the version specified in the root `package.json` and logs out any differences if there are any.

#### Features

* Makes maintaining the same `flow-bin` and `flow-typed` version a bit easier.

#### Example

```sh
$ ./node_modules/.bin/flow-mono align-versions
```
