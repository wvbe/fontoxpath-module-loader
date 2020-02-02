module.exports = {
	presets: [
		['@babel/preset-env', {
			// Excluding the regenerator transform lets us use async/await as per normal Node support
			exclude: ['@babel/plugin-transform-regenerator']
		}],
		['@babel/preset-typescript']
	],
	plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
};
