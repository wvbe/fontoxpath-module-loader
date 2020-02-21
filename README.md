# fontoxpath-module-loader

Loads XQuery modules into [fontoxpath](https://github.com/FontoXML/fontoxpath) and does something with the result. Can
be easily configured to load that module from disk, or from a REST endpoint, or whatever else async stuff you have.

Exposes the `evaluateXPath` function which is similar to `fontoxpath.evaluateXPath`, except that you give it
the location of your "main" XQuery module and it will try to resolve any "library" XQuery modules from there.

## Use

```js
import { evaluateXPath } from 'fontoxpath-module-loader';

const result = await evaluateXPath(
	// Given a target location and referrer, return the location.
	(referrer, target) => path.resolve(path.dirname(referrer), target),

	// Given a target location, return the contents of that XQuery module
	(target) => fs.readFileSync(target, 'utf8'),

	// The location of the main XQuery module
	'my-module-file.xqm'
);
```

Where `my-module-file.xqm` could contain, for example:

```xqm
import module namespace foo = "https://foo.bar" at "./my-other-xquery-example.xql";

foo:do-something()
```

## `evaluateXPath`

Runs a query and returns the result to you. Is the same as `fontoxpath.evaluateXPath` with exception of the first three
arguments:

| _n_ | Name & type                                                           | Description                                                                                                                                                |
|-----|-----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.  | `resolveLocation (referrer: string, target: string): Promise<string>` | Translates a potentially relative file reference to an absolute file reference. Used to resolve one module referring to another one. May return a promise. |
| 2.  | `resolveContent (target: string): Promise<string>`                    | Download/steal/borrow the XQuery module source that belongs to the given `target` location. May return a promise.                                          |
| 3.  | `location: string`                                                    | The location of your main XQuery module.                                                                                                                   |

Please revise the [fontoxpath](https://github.com/FontoXML/fontoxpath) documentation for the other arguments of
`evaluateXPath`:

| _n_ | Name & type                         | Description                                                                                                                                                                       |
|-----|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 4.  | `contextNode?: fontoxpath.Node`     | Is exactly the `contextNode` argument that would normally be passed to `fontoxpath.evaluateXPath`.                                                                                |
| 5.  | `domFacade?: fontoxpath.IDomFacade` | Is exactly the `domFacade` argument that would normally be passed to `fontoxpath.evaluateXPath`.                                                                                  |
| 6.  | `variables?: object`                | Is exactly the `variables` argument that would normally be passed to `fontoxpath.evaluateXPath`.                                                                                  |
| 7.  | `returnType?: number`               | Is exactly the `returnType` argument that would normally be passed to `fontoxpath.evaluateXPath`.                                                                                 |
| 8.  | `options?: any`                     | Is exactly the `options` argument that would normally be passed to `fontoxpath.evaluateXPath`. The `language` property defaults to `fontoxpath.evaluateXPath.XQUERY_3_1_LANGUAGE` |

Returns a node, string, boolean, number, array, object or null based on the expression in your XQuery module file.

## `evaluateUpdatingExpression`

Runs a query, updates the given DOM in place, and potentially also returns a result to you. Is the same as
`fontoxpath.evaluateUpdatingExpression` with exception of the first three arguments:

| _n_ | Name & type                                                           | Description                                                                                                                                                |
|-----|-----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.  | `resolveLocation (referrer: string, target: string): Promise<string>` | Translates a potentially relative file reference to an absolute file reference. Used to resolve one module referring to another one. May return a promise. |
| 2.  | `resolveContent (target: string): Promise<string>`                    | Download/steal/borrow the XQuery module source that belongs to the given `target` location. May return a promise.                                          |
| 3.  | `location: string`                                                    | The location of your main XQuery module.                                                                                                                   |

Please revise the [fontoxpath](https://github.com/FontoXML/fontoxpath) documentation for the other arguments of
`evaluateUpdatingExpression`:

| _n_ | Name & type                         | Description                                                                                        |
|-----|-------------------------------------|----------------------------------------------------------------------------------------------------|
| 4.  | `contextNode?: fontoxpath.Node`     | Is exactly the `contextNode` argument that would normally be passed to `fontoxpath.evaluateXPath`. |
| 5.  | `domFacade?: fontoxpath.IDomFacade` | Is exactly the `domFacade` argument that would normally be passed to `fontoxpath.evaluateXPath`.   |
| 6.  | `variables?: object`                | Is exactly the `variables` argument that would normally be passed to `fontoxpath.evaluateXPath`.   |
| 7.  | `options?: any`                     | Is exactly the `options` argument that would normally be passed to `fontoxpath.evaluateXPath`.     |

Will apply any updates as per your XQUF expression to the given `contextNode`. Additionally, your XQUF may return
something which results in this function resolving to that node, string, number, similar to what `evaluateXPath` would
return.
