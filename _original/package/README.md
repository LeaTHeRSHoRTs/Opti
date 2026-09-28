# Opti

[![npm version](https://img.shields.io/npm/v/optijs)](https://www.npmjs.com/package/optijs)
![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![issues](https://img.shields.io/github/issues/LeaTHeRSHoRTs/Opti)

_Desc pending_

## Parts
Opti is divided into 6 parts:
  - `opti` : The core module that augments prototypes and adds globals.
  - `opti/crafty` : Exposes the `Crafty` class that provides new ways to make elements, fragments, and more.
  - `opti/unsync` : Provides the `Thread` class to make working with Web Workers easier, and provides new `Emitter` and `SetEmitter` classes for event emission, along with new event listeners on `EventTarget`
  - `opti/query` : Adds the new `$` and `$$` global function-objects that provide new ways to query globally
  - `opti/request` : Exposes a new `request` global function-object that can request files and urls
  - `opti/flow` : Provides the `Flow` class for checking wether object, functions and more are safe to use at runtime

## Installation

### JS and TS

To use Opti, just include the base script in your HTML file:

```html
<script type="importmap" src="https://unpkg.com/opti/importmap.json"></script>
```
And then import the module in your `.js` file:
```js
import "opti"; 
```

To use the other submodules, you only need to add another import under the base `import "opti";` line:

```js
import "opti";
import "opti/query";
import "opti/crafty";
// More submodules can be added after
```

### TS only

To use Opti's types, simply follow the instructions listed above, and then use like so:

```ts
import "opti";

function myFunc(val: string | number, convertType): Future<string, Exception> {

}

```

## Usage

Now you have Opti installed, you probably wondering how to use its features.

Opti does not expose explicit imports. Features are instead attached to globals and built in objects, which makes the additions of Opti less obvious to novice users. This is why Opti exposes tools to help users find features easier.

To find Opti's features, you can either:
 1. Use the js `Opti.help(...)` command to find features and specific feature usages
 2. Or use the command line `opti` tool

<hr>

### `opti.help`
 
The `opti.help` method lists all available features included in the `opti` module.

```js
Opti.help();
```

To find help for a specific feature, just put the feature name in the parentheses

```js
Opti.help("feature");
```

To search a submodule's features, simply put the name of the submodule after `Opti`, and use the help command similarly:

```js
Opti.crafty.help("craft");
Opti.query.help("$")
Opti.request.help("request");
```
<hr>

### `opti` CLI

To use the Opti CLI, you first have to install Opti using `npm`:
```bash
# To install globally
npm install -g opti

# To install locally
npm install opti

# Or just to run the CLI independently
npx opti
```

Then you can use the features of the CLI, such as:
 - `explain` certain features
 - find `where` Opti is used in the workspace
 - `suggest` where Opti could be applied