"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fontoxpath = require("fontoxpath");
// Matches a namespace prefix and url from the module declaration
exports.MATCH_MODULE_NS_FROM_STRING = /(?:\n|^)module namespace ([a-z0-9]*) = "(.*)"/m;
exports.MATCH_IMPORTED_MODULE_NS_FROM_STRING = new RegExp([
    "import",
    "\\s+",
    "module",
    "\\s+",
    "namespace",
    "\\s+",
    "([a-z0-9]*)",
    "\\s*",
    "=",
    "\\s*",
    "\"([^\"]*)\"",
    // The optional "at" part:
    "(?:",
    "\\s+",
    "at",
    "\\s+",
    "\"([^\"]*)\")?;" // file capture group
].join(''), 'gm');
function getXQueryModulesInSourceOrder(resolveLocation, resolveContent, location, asMainModule) {
    return __awaiter(this, void 0, void 0, function () {
        var modules, contents, namespaceInfo, dependencies, match, matchImportedModuleNsFromString, _occurrence, importPrefix, importUrl, importLocation, importResolvedLocation, _a, _b, _c, _match, prefix, url;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    modules = [];
                    return [4 /*yield*/, resolveContent(location)];
                case 1:
                    contents = _d.sent();
                    namespaceInfo = exports.MATCH_MODULE_NS_FROM_STRING.exec(contents);
                    if (!asMainModule && !namespaceInfo) {
                        // An XQuery library module (ie. not an XQuery main module) must always declare itself like:
                        //   module namespace myprefix = "https://my/uri";
                        throw new Error('Could not extract namespace info from XQuery module\n\t' + location);
                    }
                    dependencies = [];
                    match = null;
                    matchImportedModuleNsFromString = new RegExp(exports.MATCH_IMPORTED_MODULE_NS_FROM_STRING.source, exports.MATCH_IMPORTED_MODULE_NS_FROM_STRING.flags);
                    _d.label = 2;
                case 2:
                    if (!((match = matchImportedModuleNsFromString.exec(contents)) !== null)) return [3 /*break*/, 7];
                    _occurrence = match[0], importPrefix = match[1], importUrl = match[2], importLocation = match[3];
                    dependencies.push(importUrl);
                    if (!importLocation) return [3 /*break*/, 5];
                    return [4 /*yield*/, resolveLocation(location, importLocation)];
                case 3:
                    importResolvedLocation = _d.sent();
                    _b = (_a = modules).concat;
                    return [4 /*yield*/, getXQueryModulesInSourceOrder(resolveLocation, resolveContent, importResolvedLocation, false)];
                case 4:
                    modules = _b.apply(_a, [_d.sent()]);
                    return [3 /*break*/, 6];
                case 5:
                    modules.push({
                        contents: "module namespace " + importPrefix + " = \"" + importUrl + "\";",
                        dependencies: [],
                        location: null,
                        main: false,
                        prefix: importPrefix,
                        unresolved: true,
                        url: importUrl
                    });
                    _d.label = 6;
                case 6: return [3 /*break*/, 2];
                case 7:
                    _c = namespaceInfo || [], _match = _c[0], prefix = _c[1], url = _c[2];
                    modules.push({
                        contents: contents,
                        dependencies: dependencies,
                        location: location,
                        main: !!asMainModule,
                        prefix: prefix,
                        unresolved: false,
                        url: url
                    });
                    return [2 /*return*/, modules.filter(function (mod, i, all) { return all.findIndex(function (m) { return m.url === mod.url; }) === i; })];
            }
        });
    });
}
function getXQueryModulesInDependencyOrder(resolveLocation, resolveContent, location) {
    return __awaiter(this, void 0, void 0, function () {
        var modulesInRandomOrder, modulesInDependencyOrder, safety, nextModuleWithoutUnresolvedDependencies, main;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getXQueryModulesInSourceOrder(resolveLocation, resolveContent, location, true)];
                case 1:
                    modulesInRandomOrder = _a.sent();
                    modulesInDependencyOrder = [];
                    safety = modulesInRandomOrder.length;
                    while (modulesInRandomOrder.length) {
                        if (--safety < 0) {
                            throw new Error("Could not resolve dependencies for " + modulesInRandomOrder.length + " modules:\n\t" +
                                modulesInRandomOrder.map(function (m) { return m.url; }));
                        }
                        nextModuleWithoutUnresolvedDependencies = modulesInRandomOrder.find(function (mod) {
                            return mod.dependencies.every(function (dep) { return modulesInDependencyOrder.find(function (m) { return m.url === dep; }); });
                        });
                        if (!nextModuleWithoutUnresolvedDependencies) {
                            throw new Error('Ups');
                        }
                        modulesInRandomOrder.splice(modulesInRandomOrder.indexOf(nextModuleWithoutUnresolvedDependencies), 1);
                        modulesInDependencyOrder.push(nextModuleWithoutUnresolvedDependencies);
                    }
                    main = modulesInDependencyOrder.find(function (mod) { return mod.main; });
                    if (!main) {
                        throw new Error('No main module');
                    }
                    return [2 /*return*/, {
                            main: main,
                            libraries: modulesInDependencyOrder.filter(function (mod) { return mod !== main; })
                        }];
            }
        });
    });
}
exports.getXQueryModulesInDependencyOrder = getXQueryModulesInDependencyOrder;
var loadedIntoFontoxpath = [];
function loadXQueryModule(library) {
    if (loadedIntoFontoxpath.includes(library.location)) {
        // fontoxpath crashes if we register the same functions twice, but it also doesnt have a way to unregister
        // an XQuery module. Ergo, when we've registered a module in the past we'll just ignore it, and hope it didn't
        // change in the mean time.
        return;
    }
    fontoxpath.registerXQueryModule(library.contents);
    loadedIntoFontoxpath.push(library.location);
}
function evaluateXPath(resolveLocation, resolveContent, location, contextNode, domFacade, variables, returnType, options) {
    return __awaiter(this, void 0, void 0, function () {
        var modules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getXQueryModulesInDependencyOrder(resolveLocation, resolveContent, location)];
                case 1:
                    modules = _a.sent();
                    modules.libraries.forEach(loadXQueryModule);
                    if (!options) {
                        options = {};
                    }
                    if (!options.language) {
                        options.language = fontoxpath.evaluateXPath.XQUERY_3_1_LANGUAGE;
                    }
                    return [2 /*return*/, fontoxpath.evaluateXPath(modules.main.contents, contextNode, domFacade, variables, returnType, options)];
            }
        });
    });
}
exports.evaluateXPath = evaluateXPath;
//# sourceMappingURL=index.js.map