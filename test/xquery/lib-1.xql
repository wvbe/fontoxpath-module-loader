module namespace lib1 = "https://lib/1";

import module namespace lib2 = "https://lib/2" at "./lib-2.xql";

declare function lib1:do () as xs:string {
	lib2:do()
};


