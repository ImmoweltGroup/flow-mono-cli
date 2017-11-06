# `flow-mono align-versions`

Compares all mono-repo packages with a dependency to `flow-bin` or `flow-typed` and logs out any differences in the versions based on the root `package.json`.

#### Features

* Makes maintaining the same `flow-bin` and `flow-typed` version across your mono-repo packages a bit easier.

#### Example

```sh
$ flow-mono align-versions
```
