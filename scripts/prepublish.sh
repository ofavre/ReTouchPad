#!/bin/bash
set -e

SNAPSHOT_SUFFIX="--SNAPSHOT"

# Check the git repository is clean
clean="$(git status --porcelain | ( grep -v '^??' || true ) )"
if [ -n "$clean" ]; then
    echo "Your git repository is not clean:"
    echo "$clean"
    exit 1
fi

# Get the current version
current_version="$(node -e 'console.log(require("./package").version);')"
# Remove the snapshot suffix for a release
version="${current_version%${SNAPSHOT_SUFFIX}}"
# Set the next development version
sed -i -r -e "s/(\"version\"[^:]*:[^\"]*)\"$current_version\"/\1\"$version\"/" package.json
# Commit
git add package.json
git commit -s -m "v$version"
git tag "v$version" -s -m "v$version"
