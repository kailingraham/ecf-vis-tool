export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.077d3efd.js","imports":["_app/immutable/entry/start.077d3efd.js","_app/immutable/chunks/index.019f7634.js","_app/immutable/chunks/singletons.2cb994d3.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.77b1c4dd.js","imports":["_app/immutable/entry/app.77b1c4dd.js","_app/immutable/chunks/index.019f7634.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
