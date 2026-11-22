# Opti

[![npm version](https://img.shields.io/npm/v/optijs)](https://www.npmjs.com/package/optijs)
![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![issues](https://img.shields.io/github/issues/LeaTHeRSHoRTs/Opti)

_Desc pending_

## Parts
Opti is divided into 6 parts:
  - Opti: The core part of Opti, adding many new properties to prototypes of objects, and adding some new globals
  - Crafty: A submodule for creating elements more efficiently 

## Installation and Usage

### JS and TS

And then import the module in your `.js` or `.ts` file:
```js
import "opti";
```

To use the other submodules, you only  need to add imports to the main import:

```js
import { Unsync } from "opti";
// OR
import { Crafty, Query }
```

### TS only

To use Opti's types just import the relevant module:

```ts
import "opti";

let unknown: placeholder<string, number, boolean>;
const value: int = condition ? 32n : 32;
const elTag: HTMLTag = 'a';

function myFunc(val: string | number, convertType): Future<string, Error> {
  return new Future((res, rej) => {
    if (cond) {
      res("Success");
    } else {
      rej(new Error("Failure"));
    }
  });
}

```