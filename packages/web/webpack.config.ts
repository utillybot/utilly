/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import 'webpack-dev-server';

const cssModulesIdentName = (devMode: boolean) =>
	devMode ? '[name]__[local]' : '[hash:base64]';

const config = (): Configuration => {
	const mode =
		process.env.NODE_ENV == 'production' ? 'production' : 'development';

	const devMode = mode == 'development';

	const babelLoader = {
		loader: 'babel-loader',
		options: {
			presets: [
				'@babel/env',
				[
					'@babel/preset-react',
					{
						runtime: 'automatic',
					},
				],
			],
			plugins: [
				'@babel/plugin-transform-runtime',
				[
					'@dr.pogodin/react-css-modules',
					{
						generateScopedName: cssModulesIdentName(devMode),
						filetypes: {
							'.scss': {
								syntax: 'postcss-scss',
							},
						},
					},
				],
			],
		},
	};

	const tsLoader = {
		loader: 'ts-loader',
		options: { transpileOnly: true },
	};

	const baseConfig: Configuration = {
		entry: './src/index.tsx',
		mode: mode,
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					exclude: /node_modules/,
					use: [babelLoader, tsLoader],
				},
			],
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin({
				async: false,
				eslint: {
					files: './**/*.{ts,tsx,js,jsx}',
				},
			}),
			new HtmlWebpackPlugin({
				template: 'index.html',
			}),
			new FaviconsWebpackPlugin({
				logo: './src/assets/logo.png',
				prefix: 'static/favicons',
				outputPath: 'static/favicons',
				cache: true,
				favicons: {
					appName: 'Utilly',
					appDescription: 'The tool for the job',
					developerName: 'jtsshieh',
					developerURL: null, // prevent retrieving from the nearest package.json
					background: '#ddd',
					theme_color: '#007aff',
				},
			}),
		],
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
	};

	if (devMode) {
		baseConfig.devServer = {
			contentBase: path.join(__dirname, 'public'),
			compress: true,
			port: 4000,
			historyApiFallback: true,
		};
		baseConfig.devtool = 'cheap-module-eval-source-map';

		baseConfig.output!.filename = 'static/js/[name].js';

		baseConfig.resolve!.alias = {
			'react-dom$': 'react-dom/profiling',
			'scheduler/tracing': 'scheduler/tracing-profiling',
		};
	} else {
		baseConfig.devtool = 'source-map';
		baseConfig.optimization = {
			minimize: !devMode,
			minimizer: [
				new CssMinimizerPlugin({ sourceMap: true }),
				new TerserPlugin(),
			],
			splitChunks: {
				chunks: 'all',
			},
		};

		baseConfig.plugins?.push(
			new MiniCssExtractPlugin({
				filename: 'static/css/[name].[contenthash].css',
				chunkFilename: 'static/css/[id].[contenthash].css',
			})
		);
		baseConfig.output!.filename = 'static/js/[name].[contenthash].js';
	}

	const styleLoader = {
		loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
	};
	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: devMode,
			modules: {
				auto: true,
				localIdentName: cssModulesIdentName(devMode),
			},
		},
	};
	const postCssLoader = {
		loader: 'postcss-loader',
		options: { sourceMap: devMode },
	};
	const sassLoader = {
		loader: 'sass-loader',
		options: { sourceMap: devMode },
	};

	baseConfig.module?.rules?.push(
		{
			test: /\.s[ac]ss$/i,
			use: [styleLoader, cssLoader, postCssLoader, sassLoader],
		},
		{
			test: /\.css$/i,
			use: [styleLoader, cssLoader],
		},
		{
			test: /\.(jpg|png|gif|svg|pdf|ico)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: 'static/assets/[name].[ext]?[contenthash]',
					},
				},
			],
		}
	);

	return baseConfig;
};
export default config;
