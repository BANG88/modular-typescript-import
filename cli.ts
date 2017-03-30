#!/usr/bin/env node
import * as meow from 'meow'
import modularTypescriptImport from './index'
const cli = meow(`
	Usage
	  $ modular-typescript-import --pattern --dist

	Options
	  --pattern  glob pattern match your files [Default: src/**/*.@(tsx|ts)]
	  --dist  the destination will write file to [Default: '']

	Examples
	  $ modular-typescript-import --pattern test/*.tsx --dist dist
		❯ tree dist
			dist
			└── test
					└── index.tsx

			1 directory, 1 file
`)

const { pattern, dist, ...options } = cli.flags

modularTypescriptImport({ pattern, dist, options })
