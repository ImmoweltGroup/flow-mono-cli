# Configuration

Most commands of this CLI can be configured by either adding a `.flowmonorc` file into the root of your mono-repository, or by adding a `flow-mono` property into the root `package.json`.

#### Example configuration via `.flowmonorc`
```json
{
  "create-symlinks": {
    "ignore": ["eslint", "jest"]
  }
}
```

#### Example configuration via `package.json`
```json
{
  "name": "my-mono-repo",
  "workspaces": ["packages/*"],

  "flow-mono": {
    "create-symlinks": {
      "ignore": ["eslint", "jest"]
    }
  }
}
```
