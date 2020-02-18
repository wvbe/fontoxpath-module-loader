import path from 'path';
import fs from 'fs';

import { getXQueryModulesInDependencyOrder, MATCH_IMPORTED_MODULE_NS_FROM_STRING } from '../src/index';
describe('Regex to match a module declaration', () => {
	it('Import statement with extra whitespace everywhere', () => {
		const statement = '\timport \t module \n namespace   prefix  =  "uri"   at  "file";\n';
		const [_occurrence, importPrefix, importUrl, importLocation] =
			MATCH_IMPORTED_MODULE_NS_FROM_STRING.exec(statement) || [];
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.lastIndex = 0;
		expect(importPrefix).toBe('prefix');
		expect(importUrl).toBe('uri');
		expect(importLocation).toBe('file');
	});

	it('Import statement without file', () => {
		const statement = 'import module namespace prefix="uri";\n';
		const [_occurrence, importPrefix, importUrl, importLocation] =
			MATCH_IMPORTED_MODULE_NS_FROM_STRING.exec(statement) || [];
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.lastIndex = 0;
		expect(importPrefix).toBe('prefix');
		expect(importUrl).toBe('uri');
		expect(importLocation).toBeUndefined();
	});

	it('Import statement without whitespace', () => {
		const statement = 'importmodulenamespaceprefix="uri"at"file";';
		const [_occurrence, importPrefix, importUrl, importLocation] =
			MATCH_IMPORTED_MODULE_NS_FROM_STRING.exec(statement) || [];
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.lastIndex = 0;
		expect(importPrefix).toBeUndefined();
		expect(importUrl).toBeUndefined();
		expect(importLocation).toBeUndefined();
	});

	it('(Unsupported) Import statement without URI or file', () => {
		const statement = 'import module namespace prefix at "file";';
		const match = MATCH_IMPORTED_MODULE_NS_FROM_STRING.exec(statement);
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.lastIndex = 0;
		expect(match).toBeNull();
	});

	it('(Unsupported) Import statement without prefix', () => {
		const statement = 'import module namespace "uri" at "file";';
		const match = MATCH_IMPORTED_MODULE_NS_FROM_STRING.exec(statement);
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.lastIndex = 0;
		expect(match).toBeNull();
	});

	it('(Unsupported) Import statement without URI', () => {
		const statement = 'import module namespace prefix at "file";';
		const match = MATCH_IMPORTED_MODULE_NS_FROM_STRING.exec(statement);
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.lastIndex = 0;
		expect(match).toBeNull();
	});
});

describe('Synchronous NodeJS', () => {
	it('loads modules in the correct order', async () => {
		const modules = await getXQueryModulesInDependencyOrder(
			(a, b) => path.resolve(path.dirname(a), b),
			a => fs.readFileSync(a, 'utf8'),
			path.resolve(__dirname, 'xquery', 'main.xqm')
		);
		expect(modules.libraries.map(mod => mod.prefix)).toEqual(['lib2', 'lib1']);
	});
});
