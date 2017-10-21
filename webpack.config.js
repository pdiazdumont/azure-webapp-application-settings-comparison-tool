const path = require('path')

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		https: true
	},
	devtool: "source-map",
	watch: true,
	module: {
		rules: [
			{ test: /\.js$/, use: "babel-loader", exclude: "/node_modules" }
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, "src"), "./node_modules"],
		extensions: [".js"]
	}
}
