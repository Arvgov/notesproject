var config = {
  mode: 'production',
  resolve: {
    modules: [
      "node_modules"
    ]
  },
  plugins: [],
  module: {
    rules: []
  }
};

// entry
config.entry = {
    main: ["/home/anti/Projects/notesproject/notes-common/build/js/packages/notes-common/kotlin-dce/notes-common.js"]
};

config.output = {
    path: "/home/anti/Projects/notesproject/notes-common/build/distributions",
    filename: (chunkData) => {
        return chunkData.chunk.name === 'main'
            ? "notes-common.js"
            : "notes-common-[name].js";
    },
    library: "notes-common",
    libraryTarget: "umd",
};

// resolve modules
config.resolve.modules.unshift("/home/anti/Projects/notesproject/notes-common/build/js/packages/notes-common/kotlin-dce")

// source maps
config.module.rules.push({
        test: /\.js$/,
        use: ["kotlin-source-map-loader"],
        enforce: "pre"
});
config.devtool = 'source-map';

// save evaluated config file
var util = require('util');
var fs = require("fs");
var evaluatedConfig = util.inspect(config, {showHidden: false, depth: null, compact: false});
fs.writeFile("/home/anti/Projects/notesproject/notes-common/build/reports/webpack/notes-common/webpack.config.evaluated.js", evaluatedConfig, function (err) {});

// Report progress to console
// noinspection JSUnnecessarySemicolon
;(function(config) {
    const webpack = require('webpack');
    const handler = (percentage, message, ...args) => {
        let p = percentage * 100;
        let msg = `${Math.trunc(p / 10)}${Math.trunc(p % 10)}% ${message} ${args.join(' ')}`;
        msg = msg.replace(new RegExp("/home/anti/Projects/notesproject/notes-common/build/js", 'g'), '');;
        console.log(msg);
    };

    config.plugins.push(new webpack.ProgressPlugin(handler))
})(config);
module.exports = config
