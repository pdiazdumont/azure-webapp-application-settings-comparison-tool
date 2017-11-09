const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],
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
      { test: /\.js|\.jsx$/, use: "babel-loader", exclude: ["/node_modules", path.resolve(__dirname, "src/adal.js")] },
      { test: /\.js|\.jsx$/, use: "eslint-loader", exclude: ["/node_modules", path.resolve(__dirname, "src/adal.js")] },
      { test: /\.scss$/, use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "sass-loader"
        },
      ] },
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "./node_modules"],
    extensions: ['.js', '.jsx']
  }
}
