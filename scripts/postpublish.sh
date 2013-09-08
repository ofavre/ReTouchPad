#!/bin/bash
set -e

SNAPSHOT_SUFFIX="--SNAPSHOT"

# Get the current version
current_version="$(node -e 'console.log(require("./package").version);')"
# Remove an eventually leftover snapshot suffix
version="${current_version%${SNAPSHOT_SUFFIX}}"
# Increment the patch-level
version="$(semver -i patch "$version")"
# Append the snapshot suffix
version="$version$SNAPSHOT_SUFFIX"
# Set the next development version
sed -i -r -e "s/(\"version\"[^:]*:[^\"]*)\"$current_version\"/\1\"$version\"/" package.json
# Commit
git add package.json
git commit -m "Prepare next development iteration"
