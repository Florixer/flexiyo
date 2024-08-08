const path = require('path');

module.exports = {
    mode: 'production',
    entry: './musixmatchAPI.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'musixmatchAPI.bundle.js',
        library: 'MusixMatchAPI',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
