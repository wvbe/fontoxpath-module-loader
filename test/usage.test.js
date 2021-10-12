import path from 'path';
import fs from 'fs';
import { sync } from 'slimdom-sax-parser';

import { evaluateXPath, evaluateUpdatingExpression } from '../src/index';

const exampleResolveLocation = (referrer, target) => path.resolve(path.dirname(referrer), target);
const exampleResolveContents = target => fs.readFileSync(target, 'utf8');

describe('Works?', () => {
	it('evaluateXPath', async () => {
		const returnValue = await evaluateXPath(
			exampleResolveLocation,
			exampleResolveContents,
			path.resolve(__dirname, 'xquery', 'main.xqm')
		);
		expect(returnValue).toBe('it works');
	});

	it('evaluateUpdatingExpression', async () => {
		const node = sync('<xml />');
		const result = await evaluateUpdatingExpression(
			exampleResolveLocation,
			exampleResolveContents,
			path.resolve(__dirname, 'xquery', 'xquf.xqm'),
			node
		);
		expect(result).toBe('Great success');
		expect(node.documentElement.nodeName).toBe('foo');
	});
});
