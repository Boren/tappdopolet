const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: path.join(__dirname, 'src/js/background.ts'),
        content: path.join(__dirname, 'src/js/content.ts'),
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/[name].js',
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/manifest.json', to: 'manifest.json' },
            { from: 'src/css', to: 'css' },
            { from: 'src/db.json', to: 'db.json' },
            { from: 'src/*.png', to: '', flatten: true },
        ]),
    ],
};
