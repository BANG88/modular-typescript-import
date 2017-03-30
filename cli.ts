#!/usr/bin/env node
const meow = require('meow')
import modularTypescriptImport from './index'
const cli = meow(`
	Usage
	  $ modular-typescript-import [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ modular-typescript-import
	  unicorns & rainbows
	  $ modular-typescript-import ponies
	  ponies & rainbows
`)

console.log(modularTypescriptImport(cli.input[0] || 'unicorns'))
