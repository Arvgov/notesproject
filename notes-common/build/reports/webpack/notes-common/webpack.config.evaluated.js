{
  mode: 'production',
  resolve: {
    modules: [
      '/home/anti/Projects/notesproject/notes-common/build/js/packages/notes-common/kotlin-dce',
      'node_modules'
    ]
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'kotlin-source-map-loader'
        ],
        enforce: 'pre'
      }
    ]
  },
  entry: {
    main: [
      '/home/anti/Projects/notesproject/notes-common/build/js/packages/notes-common/kotlin-dce/notes-common.js'
    ]
  },
  output: {
    path: '/home/anti/Projects/notesproject/notes-common/build/distributions',
    filename: [Function: filename],
    library: 'notes-common',
    libraryTarget: 'umd'
  },
  devtool: 'source-map'
}