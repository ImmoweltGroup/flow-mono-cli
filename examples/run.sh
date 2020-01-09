#!/bin/bash
# break on all failures
set -e

cd examples

## install dependencies and run static code analysis
yarn
yarn bootstrap
yarn flow

cd -
