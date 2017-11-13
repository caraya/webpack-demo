// Require Webpack first
const webpack = require( "webpack" );
// commonsChunkPlugin
const CommonsChunkPlugin = require( "webpack/lib/optimize/CommonsChunkPlugin" );
// HTML Web Pack Plugin
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
// Globalize
const GlobalizePlugin = require( "globalize-webpack-plugin" );
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const nopt = require("nopt");

const path = require('path');
const workboxPlugin = require('workbox-webpack-plugin');

const options = nopt({
	production: Boolean
});

module.exports = {
	entry: options.production ?  {
		main: "./app/index.js",
		// What files to put in the vendor bundle
		vendor: [
			"globalize",
			"globalize/dist/globalize-runtime/number",
			"globalize/dist/globalize-runtime/currency",
			"globalize/dist/globalize-runtime/date",
			"globalize/dist/globalize-runtime/message",
			"globalize/dist/globalize-runtime/plural",
			"globalize/dist/globalize-runtime/relative-time",
			"globalize/dist/globalize-runtime/unit"
		]
	} : "./app/index.js",
	output: {
		//path: options.production ? "./dist" : "./tmp",
		pathinfo: true,
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: options.production ? "" : "http://localhost:8080/"
	},
	resolve: {
		// Consider the following extensions to be javascript
		extensions: [
			".es6",
			".js",
			".ts"
		]
	},
	// Performance budget, maxAssetSize include individual bundles
	// maxEntryPointSize referes to combined file size
	performance: {
		maxAssetSize: 100000,
		maxEntrypointSize: 300000,
		hints: 'warning'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			},
			{ test: /\.png$/, loader: "file-loader" }
		]
	},
	plugins: [
		// Debug mode on!
		new webpack.LoaderOptionsPlugin({
			debug: true
		}),
		// Generate manifest.json file in your root output directory
		// with a mapping of all source file names to their corresponding output file,
		new ManifestPlugin(),
		// Clean up the dist directory before we put stuff in it
		new CleanWebpackPlugin(['dist']),
		// Bundle Analyzer. See https://www.npmjs.com/package/webpack-bundle-analyzer
		// for more instructions
		new BundleAnalyzerPlugin({
			// Can be `server`, `static` or `disabled`.
			// Static option will generate a report.html file
			analyzerMode: 'static',
			// Host that will be used in `server` mode to start HTTP server.
			analyzerHost: '127.0.0.1',
			// Port that will be used in `server` mode to start HTTP server.
			analyzerPort: 8888,
			// Path to bundle report file that will be generated in `static` mode. Relative to bundles output directory.
			reportFilename: 'report.html',
			// Module sizes to show in report by default. Should be one of `stat`, `parsed` or `gzip`.
			defaultSizes: 'gzip',
			// Whether to automatically open report in default browser
			openAnalyzer: false,
			// If `true`, Webpack Stats JSON file will be generated in bundles output directory
			generateStatsFile: true,
			// Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
			// Relative to bundles output directory.
			statsFilename: 'stats.json',
			// Options for `stats.toJson()` method.
			// See options in: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
			statsOptions: null,
			// Log level. Can be 'info', 'warn', 'error' or 'silent'.
			logLevel: 'info'
		}),
		// Extracts CSS from files into a css bundle
		new ExtractTextPlugin({
			filename: "style.css"
		}),
		// generates a file with proper links to bundles from a template
		// in the root directory
		new HtmlWebpackPlugin({
			production: options.production,
			template: "./index-template.html"
		}),
		// Run Globalize's tasks
		new GlobalizePlugin({
			production: options.production,
			developmentLocale: "en",
			supportedLocales: [ "ar", "de", "en", "es", "pt", "ru", "zh" ],
			messages: "messages/[locale].json",
			output: "i18n/[locale].[hash].js"
		}),
		// Create one or more chunks from vendor bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.[hash].js'
		}),
		// Runs uglify.js
		new webpack.optimize.UglifyJsPlugin({
			compress: {
			warnings: false
			}
		}),
		// Generates precaching service worker based on our existing directories
		new workboxPlugin({
			globDirectory: "./dist",
			globPatterns: ['**/*.{html,css,js}'],
			swDest: "./dist/sw.js",
			clientsClaim: true,
			skipWaiting: true,
		})
	]
};
