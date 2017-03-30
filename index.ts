import * as ts from 'typescript'
import * as fs from 'fs'
import * as glob from 'glob'
import * as path from 'path'
import * as mkdirp from 'mkdirp'
/**
 * camel2Dash
 *
 * @export
 * @param {string} input
 * @returns
 */
export function camel2Dash(input: string) {
	const str = input[0].toLowerCase() + input.substr(1)
	return str.replace(/([A-Z])/g, function camel2DashReplace($1) {
		return '-' + $1.toLowerCase()
	})
}
/**
 * camel2Underline
 *
 * @export
 * @param {string} input
 * @returns
 */
export function camel2Underline(input: string) {
	const str = input[0].toLowerCase() + input.substr(1)
	return str.replace(/([A-Z])/g, function ($1) {
		return '_' + $1.toLowerCase()
	})
}

export interface EditContentsOptions {
	/**
	 * content for edit
	 *
	 * @type {string}
	 * @memberOf editContentsOptions
	 */
	contents: string
	/**
	 * offset
	 *
	 * @type {number}
	 * @memberOf editContentsOptions
	 */
	offset: number
	/**
	 * content length
	 *
	 * @type {number}
	 * @memberOf editContentsOptions
	 */
	length: number
	/**
	 * new content
	 *
	 * @type {string}
	 * @memberOf editContentsOptions
	 */
	text: string
}
export interface ModularImportOptions {
	moduleName?: string
	components?: string
	style?: 'css' | boolean
	camel2Dash?: boolean
}
export class ModularImport {
	options: ModularImportOptions
	constructor(options?: ModularImportOptions) {
		this.options = {
			moduleName: 'antd',
			components: 'lib',
			style: 'css',
			camel2Dash: true,
			...options
		}
	}
	/**
	 * create source file
	 *
	 *
	 * @memberOf ModularImport
	 */
	createSourceFile = (contents: string) => ts.createSourceFile(
		'sf.tsx',
		contents,
		ts.ScriptTarget.Latest,
		false,
		ts.ScriptKind.TSX
	)
	/**
	 * get import by component name
	 *
	 *
	 * @memberOf ModularImport
	 */
	getImports = (componentName) => {
		let componentPathName = componentName
		if (this.options.camel2Dash) {
			componentPathName = camel2Dash(componentName)
		}
		const { moduleName, components, style, } = this.options
		let imports = `\nconst ${componentName} = require('${moduleName}/${components}/${componentPathName}')`
		if (style) {
			imports += `\nrequire('${moduleName}/${components}/${componentPathName}/style/css')`
		}
		console.log(imports)
		return imports
	}
	/**
	 * find imports
	 *
	 *
	 * @memberOf ModularImport
	 */
	findImports = (sourceFile: ts.SourceFile, cb) => {

		const sourceFileContent = sourceFile.text

		sourceFile.statements.forEach((statement: ts.ImportDeclaration) => {
			if (statement.kind === ts.SyntaxKind.ImportDeclaration) {
				if (statement.importClause) {
					// get module name
					const ms = statement.moduleSpecifier as any
					if (ms && ms.text == this.options.moduleName) {
						// get namedBindings
						if (statement.importClause.namedBindings) {
							const namedBindings = statement.importClause.namedBindings as ts.NamedImports
							const elements = namedBindings.elements
							if (elements.length) {
								/**
								 * get text
								 */
								const text = elements.map(is => this.getImports(is.name.text)).join('\n')

								const length = statement.end - statement.pos

								const offset = statement.pos

								const newContents = this.editContents({
									contents: sourceFileContent,
									text,
									length,
									offset
								})

								if (typeof cb === 'function') {
									cb(newContents)
								}

							}
						}
					}
				}
			}
		})
	}
	/**
	 * edit contents
	 *
	 *
	 * @memberOf ModularImport
	 */
	editContents = ({ contents, offset, length, text }: EditContentsOptions) => {
		const prefix = contents.substring(0, offset)
		const suffix = contents.substring(offset + length)
		const newContents = prefix + text + suffix
		return newContents
	}
	/**
	 * resolve
	 *
	 *
	 * @memberOf ModularImport
	 */
	resolve = ({ contents, dist = '', cb }: { contents: string, dist?: string, cb?: (newContents) => void }) => {
		const sourceFile = this.createSourceFile(contents)
		this.findImports(sourceFile, newContents => {
			console.log(`done: ${dist} `)
			if (typeof cb === 'function') {
				cb(newContents)
			}
			if (dist) {
				console.log(dist)
				const base = path.dirname(dist)
				mkdirp(base, function (err) {
					if (err) throw new Error(err)
					fs.writeFileSync(dist, newContents, { encoding: 'UTF-8' })
				})
			}
		})
	}

}
/**
 * default function
 */
export default ({ pattern = 'src/**/*.@(tsx|ts)', dist = '', options = {} } = {}) => {
	const modularImport = new ModularImport(options)
	glob(pattern, (err, files) => {
		if (err) {
			throw new Error(err)
		}
		files.forEach(f => {
			const contents = fs.readFileSync(f, 'UTF-8')
			modularImport.resolve({
				contents,
				dist: path.join(dist, f),
			})
		})
	})
}
