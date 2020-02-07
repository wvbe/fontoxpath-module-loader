import path from 'path';
import fs from 'fs';

import { registerXQueryModule, evaluateXPath } from 'fontoxpath';

import moduleLoader from '../src/index';

describe('Works?', () => {
	it('Synchronously', async () => {
		const modules = await moduleLoader(
			(referrer, target) => path.resolve(path.dirname(referrer), target),
			target => fs.readFileSync(target, 'utf8'),
			path.resolve(__dirname, 'xquery', 'main.xqm')
		);

		modules.libraries.forEach(library => registerXQueryModule(library.contents));
		const returnValue = evaluateXPath(modules.main.contents, null, null, null, null, {
			language: evaluateXPath.XQUERY_3_1_LANGUAGE
		});

		expect(returnValue).toBe('it works');
	});
});
