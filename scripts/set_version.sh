#! /bin/sh

# Set the version in Gradle project.
sed -i '' '1s/.*/lebkuchenfm_version='"$1"'/' ./service/gradle.properties
echo "Version set to $1 in Gradle project."

# Set the version in package.json.
cd ./client
npm version "$1" --no-git-tag-version
echo "Version set to $1 in npm project."
