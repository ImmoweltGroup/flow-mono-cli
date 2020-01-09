#!/bin/bash
# break on all failures
set -e

cd examples

## install dependencies and run flow commands
yarn
yarn bootstrap
yarn flow

cd -
