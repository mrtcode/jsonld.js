/**
 * jsonld.js webpack build rules.
 *
 * @author Digital Bazaar, Inc.
 *
 * Copyright 2010-2017 Digital Bazaar, Inc.
 */
const path = require('path');
const webpackMerge = require('webpack-merge');

// build multiple outputs
module.exports = [];

// custom setup for each output
// all built files will export the "jsonld" library but with different content
const outputs = [
  // core jsonld library
  {
    entry: [
      // main lib
      './lib/jsonld.js'
    ],
    filenameBase: 'jsonld'
  },
  /*
  // core jsonld library + extra utils and networking support
  {
    entry: ['./lib/index.all.js'],
    filenameBase: 'jsonld.all'
  }
  */
  // custom builds can be created by specifying the high level files you need
  // webpack will pull in dependencies as needed
  // Note: if using UMD or similar, add jsonld.js *last* to properly export
  // the top level jsonld namespace.
  //{
  //  entry: ['./lib/FOO.js', ..., './lib/jsonld.js'],
  //  filenameBase: 'jsonld.custom'
  //  libraryTarget: 'umd'
  //}
];

outputs.forEach(info => {
  // common to bundle and minified
  const common = {
    // each output uses the "jsonld" name but with different contents
    entry: {
      jsonld: info.entry
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [{
            // exclude node_modules by default
            exclude: /(node_modules)/
          }],
        }
      ]
    },
    plugins: [
      //new webpack.DefinePlugin({
      //})
    ],
    // disable various node shims as jsonld handles this manually
    node: {
      Buffer: false,
      crypto: false,
      process: false,
      setImmediate: false
    }
  };

  // optimized and minified bundle
  const minify = webpackMerge(common, {
    mode: 'production',
    optimization: {
      minimize: false
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: info.filenameBase + '.js',
      library: 'JSONLD',
      libraryTarget: 'umd',
      globalObject: 'typeof zContext === \'object\' ? zContext.Zotero : {}'
    },
    plugins: [
      /*
      new webpack.optimize.UglifyJsPlugin({
        //beautify: true,
        compress: {
          warnings: true
        },
        output: {
          comments: false
        },
        sourceMap: true
      })
      */
    ]
  });
  if(info.library === null) {
    delete minify.output.library;
  }
  if(info.libraryTarget === null) {
    delete minify.output.libraryTarget;
  }

  // module.exports.push(bundle);
  module.exports.push(minify);
});
