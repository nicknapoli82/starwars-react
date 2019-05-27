const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    '@babel/polyfill', // enables async-await
    path.join(__dirname, 'src', 'index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
	test: /\.(js|jsx)/,
	exclude: /node_modules/,
	use: {
	  loader: "babel-loader"
	}
      }
    ]
  }
};
