const path = require("path");
const package = require("./package.json");
const fs = require("fs");
const childProcess = require("child_process");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var branch = "unknown";
try {
  branch = childProcess.execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf8",
  });
  branch = branch.trim();
} catch (err) {}

const version = package.version;

console.log("This is a %s build. %s", branch, version);

fs.writeFileSync(
  "./src/version.ts",
  `
// Autogenerated by webpack.config.js
export const version = "${version}";
export const branch = "${branch}";
`
);

module.exports = (env, argv) => ({
  mode: "production",

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".scss", ".js", ".css", ".jsx"],
  },

  entry: [`./src/${env.entry}.tsx`],

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${env.entry}.css`,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      // {
      // 	test: /\.m?js$/,
      // 	exclude: /(node_modules|bower_components)/,
      // 	use: {
      // 		loader: "babel-loader",
      // 		options: {
      // 			presets: ["@babel/preset-env"]
      // 		}
      // 	}
      // },
      {
        test: /\.(s?)css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // exclude: /node_modules/
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
      },
      // {
      // 	test: /\.css$/,
      // 	use: ["css-loader"]
      // },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          publicPath: "img",
          outputPath: "img",
        },
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
    ],
  },

  output: {
    filename: `${env.entry}.js`,
    path: path.resolve(__dirname, "dist"),
  },

  // optimization: {
  // 	splitChunks: {
  // 		chunks: "all"
  // 	}
  // },

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "wazigate-system": "dashboard",
  },
});
