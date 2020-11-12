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

interface EnvOptions {
	mode: 'production' | 'development';
}

const config = (env: EnvOptions): Configuration => {
	const mode = env.mode == 'production' ? 'production' : 'development';

	const devMode = mode == 'development';

	const baseConfig: Configuration = {
		entry: './src/index.tsx',
		mode: mode,
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					exclude: /node_modules/,
					use: ['babel-loader'],
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
				logo: './public/logo.png',
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
		baseConfig.devtool = 'source-map';

		baseConfig.output!.filename = 'static/js/[name].js';

		baseConfig.resolve!.alias = {
			'react-dom$': 'react-dom/profiling',
			'scheduler/tracing': 'scheduler/tracing-profiling',
		};
	} else {
		baseConfig.optimization = {
			minimize: !devMode,
			minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
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

	baseConfig.module?.rules?.push(
		{
			test: /\.s[ac]ss$/i,
			use: [
				{
					loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
				},
				{
					loader: 'css-loader',
					options: {
						sourceMap: devMode,
						modules: {
							auto: true,
							localIdentName: '[name]__[local]__[hash:base64:5]',
						},
					},
				},
				{
					loader: 'postcss-loader',
					options: { sourceMap: devMode },
				},
				{
					loader: 'sass-loader',
					options: { sourceMap: devMode },
				},
			],
		},
		{
			test: /\.css$/i,
			use: [
				devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: { sourceMap: devMode },
				},
			],
		}
	);

	return baseConfig;
};
export default config;
