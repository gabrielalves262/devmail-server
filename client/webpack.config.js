var path = require('path');
var webpack = require('webpack')

module.exports = {
	mode: 'production',
	devtool: 'inline-source-map',
	entry: `./app/index.tsx`,
	output: {
		path: path.resolve(__dirname, 'public/src/js'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{ 
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        }
      }
		]
	},
};