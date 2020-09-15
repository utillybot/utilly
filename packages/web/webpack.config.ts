import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';

const config = (webpackEnv: string): Configuration => {
    const devMode = webpackEnv == 'development';

    return {
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            compress: true,
            port: 4000,
            historyApiFallback: true,
        },
        devtool: devMode ? 'source-map' : false,
        entry: './views/index.tsx',
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { sourceMap: devMode },
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
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
            splitChunks: {
                chunks: 'all',
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                async: false,
                eslint: {
                    files: './**/*.{ts,tsx,js,jsx}',
                },
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css',
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: 'index.html',
            }),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
    };
};
export default config;
