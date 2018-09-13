# Contributing

We are open and grateful for any contributions made by you!

## Reporting issues

Before opening an issue, please make sure that your issue hasn't been already reported by using the search functionality of the [issue tracker](https://github.com/ImmoweltGroup/flow-mono-cli/issues).

## Development

Visit the [issue tracker](https://github.com/ImmoweltGroup/flow-mono-cli/issues) to find a list of open issues that are easy to pick up or need some love.

### New features

Please open an issue with a proposal for a new feature or refactoring before starting on the work. We don't want you to waste your efforts on a pull request that we won't want to accept.

## Commit guideline

Our repositories make great use of [semantic-release](https://github.com/semantic-release/semantic-release). This tool automatically creates releases once the code is pushed to our `master` branch and the commits signal a release-worthy CI run.

All commits must contain a prefix of one of the following values, e.g.

| Prefix        | Description     | Release type  |
| ------------- | --------------- | ------------- |
| `BREAKING`    | Breaking change | Major         |
| `FEATURE`     | Feature         | Minor         |
| `BUGFIX`      | Bugfix          | Patch         |
| `SECURITY`    | Dependencies    | Patch         |

## Submitting Changes

* Open a new issue in the [issue tracker](https://github.com/ImmoweltGroup/flow-mono-cli/issues).
* Fork the repo.
* Create a new feature branch based off the `master` branch.
* Make sure all tests pass and there are no linting errors.
* Make sure to commit your changes with the guidelines written above.
* Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

Thank you for contributing! :-) :heart:
