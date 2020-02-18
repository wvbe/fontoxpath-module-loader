# fontoxpath-module-loader

Loads XQuery modules into fontoxpath and does something with the result. Can be easily configured to load that module
from disk, or from a REST endpoint, or whatever else async stuff you have.

Exposes the `evaluateXPath` function which is similar to `fontoxpath.evaluateXPath`, except that you give it
the location of your "main" XQuery module and it will try to resolve any "library" XQuery modules from there.

## Use

```js
import { evaluateXPath } from 'fontoxpath-module-loader';

const result = await evaluateXPath(
	(referrer, target) => {
		// Given a target location and referrer, return the location.

		// For example:
		return path.resolve(path.dirname(referrer), target);
	},
	(target) => {
		// Given a target location, return the contents of that XQuery module

		// For example:
		return fs.readFileSync(target, 'utf8');
	},
	'my-module-file.xqm'
);
```

## Arguments

- `resolveLocation (referrer: string, target: string): Promise<string>` Translates a potentially relative file reference
  to an absolute file reference. Used to resolve one module referring to another one. May return a promise.
- `resolveContent (target: string): string`. Download/steal/borrow the XQuery module source that belongs to the given
  `target` location. May return a promise.
- `location: string` The location of your main XQuery module.
- `contextNode?: fontoxpath.Node` Is exactly the `contextNode` argument that would normally be passed to
  `fontoxpath.evaluateXPath`.
- `domFacade?: fontoxpath.IDomFacade` Is exactly the `domFacade` argument that would normally be passed to
  `fontoxpath.evaluateXPath`.
- `variables?: object` Is exactly the `variables` argument that would normally be passed to `fontoxpath.evaluateXPath`.
- `returnType?: number` Is exactly the `returnType` argument that would normally be passed to
  `fontoxpath.evaluateXPath`.
- `options?: any` Is exactly the `options` argument that would normally be passed to `fontoxpath.evaluateXPath`. The
  `language` property defaults to `fontoxpath.evaluateXPath.XQUERY_3_1_LANGUAGE`