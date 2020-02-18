import path from 'path';
import fs from 'fs';

import { evaluateXPath } from '../src/index';

describe('Works?', () => {
	it('Synchronously', async () => {
		const returnValue = await evaluateXPath(
			(referrer, target) => path.resolve(path.dirname(referrer), target),
			target => fs.readFileSync(target, 'utf8'),
			path.resolve(__dirname, 'xquery', 'main.xqm')
		);
		expect(returnValue).toBe('it works');
	});
	it('Synchronously2', async () => {
		const returnValue = await evaluateXPath(
			(referrer, target) => path.resolve(path.dirname(referrer), target),
			target => fs.readFileSync(target, 'utf8'),
			path.resolve(__dirname, 'xquery', 'main.xqm')
		);
		expect(returnValue).toBe('it works');
	});
});
