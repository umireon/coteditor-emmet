var path = require('path')
module.exports = {
  entry: './lib/main.js',
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'Emmet.js'
  },
  node: {
    Buffer: false,
    process: false,
  }
}
