// Matches a namespace prefix and url from the module declaration
export const MATCH_MODULE_NS_FROM_STRING = /(?:\n|^)module namespace ([a-z0-9]*) = "(.*)"/m;
const validPrefixCaptureGroup = `([a-z0-9]*)`;
const validQuoteEnclosedCaptureGroup = `"([^"]*)"`;
const REGEXSTRING = [
	`import`,
	`\\s+`,
	`module`,
	`\\s+`,
	`namespace`,
	`\\s+`,
	validPrefixCaptureGroup, // prefix capture group
	`\\s*`,
	`=`,
	`\\s*`,
	validQuoteEnclosedCaptureGroup, // uri capture group
	// The optional "at" part:
	`(?:`,
	`\\s+`,
	`at`,
	`\\s+`,
	`"([^"]*)")?;` // file capture group
].join('');
export const MATCH_IMPORTED_MODULE_NS_FROM_STRING = new RegExp(REGEXSTRING, 'gm');

declare type XQueryModuleMetadata = {
	contents: string,
	dependencies: string[],
	location: string | null,
	main: boolean,
	prefix: string,
	unresolved: boolean,
	url: string
};

async function getXQueryModulesInSourceOrder(
	resolveLocation: (referrer: string, target: string) => string,
	resolveContent: (location: string) => string,
	location: string,
	asMainModule: boolean
): Promise<XQueryModuleMetadata[]> {

	let modules: XQueryModuleMetadata[] = [];

	const contents = await resolveContent(location);

	const namespaceInfo = MATCH_MODULE_NS_FROM_STRING.exec(contents);
	if (!asMainModule && !namespaceInfo) {
		// An XQuery library module (ie. not an XQuery main module) must always declare itself like:
		//   module namespace myprefix = "https://my/uri";
		throw new Error('Could not extract namespace info from XQuery module\n\t' + location);
	}

	const dependencies = [];
	let match: RegExpExecArray | null = null;

	// Clone the regular expression. For some reason that works, while resetting lastIndex does not.
	const matchImportedModuleNsFromString = new RegExp(
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.source,
		MATCH_IMPORTED_MODULE_NS_FROM_STRING.flags
	);

	while ((match = matchImportedModuleNsFromString.exec(contents)) !== null) {
		const [_occurrence, importPrefix, importUrl, importLocation] = match;
		dependencies.push(importUrl);

		// @TODO guard against circular dependencies?

		if (importLocation) {
			const importResolvedLocation = await resolveLocation(location, importLocation);
			modules = modules.concat(
				await getXQueryModulesInSourceOrder(resolveLocation, resolveContent, importResolvedLocation, false)
			);
		} else {
			modules.push({
				contents: `module namespace ${importPrefix} = "${importUrl}";`,
				dependencies: [],
				location: null,
				main: false,
				prefix: importPrefix,
				unresolved: true,
				url: importUrl
			});
		}
	}

	const [_match, prefix, url] = namespaceInfo || [];
	modules.push({
		contents,
		dependencies,
		location,
		main: !!asMainModule,
		prefix,
		unresolved: false,
		url
	});

	return modules.filter((mod, i, all) => all.findIndex(m => m.url === mod.url) === i);
}

async function getXQueryModulesInDependencyOrder(
	resolveLocation: (referrer: string, target: string) => string,
	resolveContent: (location: string) => string,
	location: string
): Promise<{ main: XQueryModuleMetadata, libraries: XQueryModuleMetadata[] }> {
	const modulesInRandomOrder = await getXQueryModulesInSourceOrder(resolveLocation, resolveContent, location, true);
	const modulesInDependencyOrder: XQueryModuleMetadata[] = [];

	let safety = modulesInRandomOrder.length;
	while (modulesInRandomOrder.length) {
		if (--safety < 0) {
			throw new Error(
				`Could not resolve dependencies for ${modulesInRandomOrder.length} modules:\n\t` +
				modulesInRandomOrder.map(m => m.url)
			);
		}
		const nextModuleWithoutUnresolvedDependencies = modulesInRandomOrder.find(mod =>
			mod.dependencies.every(dep => modulesInDependencyOrder.find(m => m.url === dep))
		);

		if (!nextModuleWithoutUnresolvedDependencies) {
			throw new Error('Ups');
		}

		modulesInRandomOrder.splice(
			modulesInRandomOrder.indexOf(nextModuleWithoutUnresolvedDependencies),
			1
		);
		modulesInDependencyOrder.push(nextModuleWithoutUnresolvedDependencies);
	}

	const main = modulesInDependencyOrder.find(mod => mod.main);
	if (!main) {
		throw new Error('No main module');
	}
	return {
		main,
		libraries: modulesInDependencyOrder.filter(mod => mod !== main)
	};
}

export default getXQueryModulesInDependencyOrder;
