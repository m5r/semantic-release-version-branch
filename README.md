# semantic-release-version-branch

A package for [semantic-release](https://github.com/semantic-release/semantic-release) that creates or updates the version branches (`v1.2.x` for example) for you depending on the release version. The plugin works only on the `success` step of `semantic-release`.

## Setup

1. Install

```
npm i -D semantic-release-version-branch
```

2. Include the plugin inside the `plugins` section of the `semantic-release` configuration.

```
{
  "plugins": [
    // ...
    "semantic-release-version-branch",
    // ...
  ]
}
```
