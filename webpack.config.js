const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    https: true
  },
  devtool: "source-map",
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react'
    })
  ],
  watch: true,
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader", exclude: ["/node_modules", path.resolve(__dirname, "src/adal.js")] },
      { test: /\.js$/, use: "eslint-loader", exclude: ["/node_modules", path.resolve(__dirname, "src/adal.js")] }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "./node_modules"],
    extensions: ['.js']
  }
}
