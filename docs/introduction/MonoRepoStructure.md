# Mono-Repository Structure

The CLI does almost no assumptions about the structure of your mono-repo, it uses `yarn`'s workspace configuration in your root `package.json` so you can place your packages where ever you want them to be.

In case you already use `yarn` workspaces, you can skip this part, otherwise just add this property to your root `package.json` and you are good to go.

```json
{
  "workspaces": ["packages/*"]
}
```

We strongly recommend having a flow instance per package, since this decreases startup time due to multi-threading. Another benefit is that it reduces the coupling of the packages to your mono-repository and the effort once you want to extract a package from your mono-repository. But don't worry, this CLI will provide you with a couple of commands to help you maintain all the single instances more easily.

This is how an example mono-repository could look like
```
.
├── build
|   └── .flowconfig      // A fallback / default / singleton `.flowconfig` that will be symlinked (for all packages that do not hold their own `.flowconfig`).
├── flow-typed           // Patched typings or global stubs.
├── node_modules         // Hoisted or root dependencies of the mono-repository.
├── packages
|   ├── package-a
|   |   ├── flow-typed   // Flow-typed stubs / typings for this package.
|   |   ├── node_modules // dependencies of this package.
|   |   ├── package.json // If the package has a dependency to `flow-bin` it will be recognized by the CLI.
|   |   └── .flowconfig  // Packages could also hold it's own `.flowconfig` if necessary.
|   └── package-b
|   |   ├── flow-typed  
|   |   ├── node_modules
|   |   └── package.json
├── .flowmonorc          // Configuration of the CLI.
└── package.json         // The `flow-mono-cli` would need to be added to the `devDependencies` in the root `package.json`
```
