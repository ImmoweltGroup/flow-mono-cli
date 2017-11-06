## Example / Integration test suite for the CLI

This folder holds an example setup of a yarn workspace with multiple packages that have dependencies between each other, as well as a dependency to `log-fancy` which in-direct dependencies need to be stubbed to work correctly.

**Note: The `precreate-stubs` and `postcreate-stubs` scripts are only needed in this example since `flow-typed create-stub` would move the created stubs a directory higher since it can find a `.flowconfig` there.**
