import test from 'ava'
import fn, { ModularImport } from '../index'
import * as fs from 'fs'

test('ModularImport', t => {
	const modularImport = new ModularImport({
		camel2Dash: false
	})

	const expected = `
const Button = require('antd/lib/Button')
require('antd/lib/Button/style/css')

const message = require('antd/lib/message')
require('antd/lib/message/style/css')`

	modularImport.resolve({
		contents: `import { Button, message } from 'antd'`,
		cb: newContents => t.is(newContents, expected)
	})
})


test('getImports', t => {
	const modularImport = new ModularImport({
		components: 'a'
	})

	const expected = `
const Button = require('antd/a/button')
require('antd/a/button/style/css')`

	const content = modularImport.getImports('Button')

	t.is(content, expected)
})


test('camel2Dash', t => {
	const modularImport = new ModularImport({
		components: 'a'
	})

	const expected = `
const DatePicker = require('antd/a/date-picker')
require('antd/a/date-picker/style/css')`

	const content = modularImport.getImports('DatePicker')

	t.is(content, expected)
})


test('file exist', t => {

	const dist = __dirname + '/dist/test/index.tsx'

	fn({
		pattern: 'test/index.tsx',
		dist: __dirname + '/dist/'
	})

	const expected = `
const DatePicker = require('antd/lib/date-picker')
require('antd/lib/date-picker/style/css')`


	setTimeout(function () {
		const content = fs.readFileSync(dist, 'UTF-8')
		t.is(content, expected)
	}, 1000)
})
