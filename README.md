# @timkendrick/babel-preset-vscode
[![npm version](https://img.shields.io/npm/v/@timkendrick/babel-preset-vscode.svg)](https://www.npmjs.com/package/@timkendrick/babel-preset-vscode)
![Stability](https://img.shields.io/badge/stability-experimental-yellow.svg)

> Babel preset for Visual Studio Code modules

Transform modules written for the Visual Studio Code AMD loader into standard CommonJS modules.

# Installation

```bash
npm install --save-dev @timkendrick/babel-preset-vscode
```

# Usage

## Via .babelrc (Recommended)

### .babelrc

```json
{
  "presets": [
    "@timkendrick/babel-preset-vscode"
  ]
}
```

## Via CLI

```bash
babel script.js --presets @timkendrick/babel-preset-vscode
```

## Via Node API

```javascript
require("babel-core").transform("code", {
  presets: [
    "@timkendrick/babel-preset-vscode"
  ]
});
```
