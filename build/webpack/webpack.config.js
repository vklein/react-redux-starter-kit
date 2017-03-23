'use strict'; // eslint-disable-line
/***** WARNING: ES5 code only here. Not transpiled! *****/
/* eslint-disable */
/* eslint-disable no-var */

const webpack = require('webpack');
const qs = require('qs');
const autoprefixer = require('autoprefixer');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CopyGlobsPlugin = require('./webpack.plugin.copyglobs');
const mergeWithConcat = require('./util/mergeWithConcat');
const config = require('./config');

const assetsFilenames = (config.env.production) ? '[name].min' : '[name]';

// multiple extract instances
let extractAssets = new ExtractTextPlugin({
    filename: `styles/${assetsFilenames}.css`,
    allChunks: true,
    disable: (config.enabled.watcher),
});
let extractComponentCSS = new ExtractTextPlugin({
    filename: `styles/${assetsFilenames}.css`,
    allChunks: true,
    disable: (config.enabled.watcher),
});

let extractComponentMJML = new ExtractTextPlugin({
    filename: `../../module/[name].phtml`,
    allChunks: true,
    disable: (config.enabled.watcher),
});

const jsRule = {
    test: /\.(js|jsx)$/,
    exclude: [/(node_modules|bower_components)(?![/|\\](bootstrap|foundation-sites))/],
    use: [{
        loader: 'babel-loader',
        options: require(config.babelFile)
    }]
};

if (config.enabled.watcher) {
    jsRule.use.unshift('monkey-hot?sourceType=module');
}

let webpackConfig = {
    bail: config.enabled.bail,
    context: config.paths.assets,
    entry: config.entry,
    devtool: (config.enabled.sourceMaps ? '#source-map' : false),
    output: {
        path: config.paths.dist,
        publicPath: config.publicPath,
        pathinfo: true,
        filename: `scripts/${assetsFilenames}.js`,
        chunkFilename: `scripts/chunks/${assetsFilenames}[chunkhash].js`,
        jsonpFunction: config.jsonpFunction
    },
    module: {
        rules: [
            jsRule,
            {
                test: /\.mjml$/,
                loader: extractComponentMJML.extract({
                    loader: [
                        {
                            loader: 'mjml-with-images-loader',
                            options: {
                                onlyHtml: true
                            }
                        },
                    ],
                }),
            },
            {
                test: /\.scss$/,
                include: config.paths.assets,
                loader: extractAssets.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    loader: [
                        {
                            loader: 'css-loader?modules&importLoaders=1',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                }),
            },
            {
                test: /\.scss$/,
                exclude: config.paths.assets,
                loader: extractComponentCSS.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    loader: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: config.env.production ? '[hash:base64:5]' : '[local]_[hash:base64:5]',
                                camelCase: true,
                                sourceMap: config.enabled.sourceMaps
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                }),
            },
            {
                test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `vendor/[name].[ext]`,
                    }
                }],
            },
        ],
    },
    stats: {
        colors: {
            green: '\u001b[32m',
        }
    },
    resolve: {
        extensions: ['.js', '.jsx', '.es6'],
        modules: [
            config.paths.js,
            'node_modules',
            'bower_components',
        ],
        enforceExtension: false,
    },
    externals: {
        jquery: 'jQuery',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(config.env.nodeEnv)
            }
        }),
        new webpack.IgnorePlugin(/^props$/),
        new CleanPlugin([config.paths.dist], {
            root: config.paths.root,
            verbose: false,
        }),
        /**
         * It would be nice to switch to copy-webpack-plugin, but
         * unfortunately it doesn't provide a reliable way of
         * tracking the before/after file names
         */
        new CopyGlobsPlugin({
            pattern: config.copy,
            output: `[path]${assetsFilenames}.[ext]`,
            manifest: config.manifest,
        }),
        extractAssets,
        extractComponentCSS,
        extractComponentMJML,
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether',
            'window.Tether': 'tether',
        }),
        new webpack.LoaderOptionsPlugin({
            // minimize: true,
            debug: config.enabled.watcher,
            stats: {colors: true},
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.s?css$/,
            options: {
                output: {path: config.paths.dist},
                context: config.paths.assets,
                postcss: [
                    autoprefixer({browsers: config.browsers}),
                ],
            },
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.(js|jsx)$/,
            options: {
                eslint: {
                    configFile: './build/webpack/eslint.js',
                    useEslintrc: false,
                    failOnWarning: false,
                    failOnError: true,
                },
            },
        }),
    ],
};

webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: `scripts/shared${(config.env.production) ? '.min' : ''}.js`,
        minChunks: Infinity, // (with more entries, this ensures that no other module goes into the vendor chunk)
    })
);

/* eslint-disable global-require */ /** Let's only load dependencies as needed */

if (config.enabled.optimize) {
    webpackConfig = mergeWithConcat(webpackConfig, require('./webpack.config.optimize'));
}

if (config.env.production) {
    webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /^console.log$/,
        "./bundle/debug-noop"
    ));
    // const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
    // webpackConfig.recordsPath = './.webpack-cache/client-records.json';
    // webpackConfig.plugins.unshift(new HardSourceWebpackPlugin({cacheDirectory: './.webpack-cache/client'}));
}

if (config.enabled.cacheBusting) {
    const WebpackAssetsManifest = require('webpack-assets-manifest');

    webpackConfig.plugins.push(
        new WebpackAssetsManifest({
            output: 'assets.json',
            space: 2,
            writeToDisk: false,
            assets: config.manifest,
            replacer: require('./util/assetManifestsFormatter'),
        })
    );
}

if (config.enabled.eslint) {
    webpackConfig.module.rules = webpackConfig.module.rules || [];
    webpackConfig.module.rules.push(
        {
            test: /\.(js|jsx)$/,
            loader: 'eslint-loader',
            enforce: "pre",
            options: {
                configFile: './build/webpack/eslint.js',
                useEslintrc: false
            }
        }
    );
}

if (config.enabled.watcher) {
    webpackConfig.entry = require('./util/addHotMiddleware')(webpackConfig.entry);
    webpackConfig = mergeWithConcat(webpackConfig, require('./webpack.config.watch'));
}

module.exports = webpackConfig;


/* eslint-enable no-var */