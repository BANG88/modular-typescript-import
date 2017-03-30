# modular-typescript-import [![Build Status](https://travis-ci.org/bang88/modular-typescript-import.svg?branch=master)](https://travis-ci.org/bang88/modular-typescript-import) [![Coverage Status](https://coveralls.io/repos/github/bang88/modular-typescript-import/badge.svg?branch=master)](https://coveralls.io/github/bang88/modular-typescript-import?branch=master)

> Modular typescript import


## Install

```
$ npm install --save modular-typescript-import

# or

$ yarn add modular-typescript-import
```


## Usage

```js
import modularTypescriptImport from 'modular-typescript-import'

modularTypescriptImport(options);
```


## API

### modularTypescriptImport([options])

Please read the source code for more informations.

## CLI

```
$ npm install --global modular-typescript-import
```

```
$ modular-typescript-import --help

  Usage
	  $ modular-typescript-import --pattern --dist

	Options
	  --pattern  glob pattern match your files [Default: src/**/*.@(tsx|ts)]
	  --dist  the destination will write file to [Default: '']

	Examples
	  $ modular-typescript-import --pattern test/*.tsx --dist dist

```

## Demo

### input

```ts
import * as React from 'react'
import { Button, message, Alert, Form, Layout } from 'antd';
declare interface DemoProps {
	children?: React.ReactNode
}
declare interface DemoState { }
class Demo extends React.Component<DemoProps, DemoState> {
	render() {
		return (
			<div className="Demo">
				Component
			</div>
		)
	}
}

export default Demo
```
### output

```ts
import * as React from 'react'
const Button = require('antd/lib/button')
require('antd/lib/button/style/css')

const message = require('antd/lib/message')
require('antd/lib/message/style/css')

const Alert = require('antd/lib/alert')
require('antd/lib/alert/style/css')

const Form = require('antd/lib/form')
require('antd/lib/form/style/css')

const Layout = require('antd/lib/layout')
require('antd/lib/layout/style/css')
declare interface DemoProps {
	children?: React.ReactNode
}
declare interface DemoState { }
class Demo extends React.Component<DemoProps, DemoState> {
	render() {
		return (
			<div className="Demo">
				Component
			</div>
		)
	}
}

export default Demo

```

## License

MIT © [bang](https://github.com/bang88)
