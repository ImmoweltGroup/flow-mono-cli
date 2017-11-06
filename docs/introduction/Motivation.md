# Motivation

As of now maintaining a mono-repository with flow is hard, there are a few issues within flow itself that you will stumble upon when adding flow to your mono-repository such as the all to common `Required module not found` error which pops up when using Lernas `--hoist` or even yarn workspaces feature.

Here is a list of issues that we try to solve, if you find yourself in one of these, you may want to try out this CLI and see if it helps to solve your problems.

* [Having nested .flowconfig files in different folders](https://github.com/facebook/flow/issues/4738)
* [Finding types from external dependencies when using Yarn workspaces](https://github.com/facebook/flow/issues/5107)
* [Don't typecheck or load files under node_modules/ unless they're imported by flow-typed files](https://github.com/facebook/flow/issues/869)
* [How to apply flow type checking in lerna managed project?](https://github.com/lerna/lerna/issues/891)

We do not intend to replace existing packages and furthermore we find it to be of importance that these issues are getting fixed at their respective packages but in the meantime a separate CLI was the fastest and best option we found. This CLI does only target mono-repository specific problems and we might introduce more commands in the future which are not only bug/issue related, but more developer-experience oriented! :-)  
