import path from 'path';
import fs from 'fs';

import { getModules } from '../src/index';

const exampleResolveLocation = (referrer, target) => path.resolve(path.dirname(referrer), target);
const exampleResolveContents = target => fs.readFileSync(target, 'utf8');

describe('Synchronous NodeJS', () => {
	it('loads modules in the correct order', async () => {
		const modules = await getModules(
			exampleResolveLocation,
			exampleResolveContents,
			path.resolve(__dirname, 'xquery', 'main.xqm')
		);
		expect(modules.libraries.map(mod => mod.prefix)).toEqual(['lib2', 'lib1']);
	});
});
