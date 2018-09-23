const path  = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

resolve = (file) => {
	return path.join(__dirname, file);
}

const srcPath = resolve('src');
const buildPath = resolve('build');

module.exports = {
	entry: path.join(srcPath, "app.js"),
	output: {
		path: buildPath,
		filename: "bundle.js"
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(srcPath, "index.html")
		})
	],
	devtool: "source-map",
	devServer: {
		contentBase: './src',
		watchContentBase: true
	}
}