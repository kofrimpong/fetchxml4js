# fetchxml4js
A declarative JavaScript library for creating Dataverse fetchxml queries

## Table of Contents

- [Intallation](#installation)
- [Usage](#usage)
- [Basics](#basics)
- [Dynamic Where](#dynamic-where-(wherebuilder))
- [Utilit Functions](#utility-functions)

## Installation
Npm:
```
npm install fetchxml4js --save
```

Npm TypeScript definitions:
```
npm install @types/fetchxml4js --save-dev
```
## Usage

In browser:

```html
<script type="text/javascript" src="//fetchxml4js.js"></script>
```

In node:

```js
var caml4js = require('fetchxml4js');
```

ES6 modules:
```js
import {LinkType, attributes, choiceColumn} from 'fetchxml4js';
```

## Basics

