import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import tsImportPluginFactory from 'ts-import-plugin'
import { Configuration, DefinePlugin } from 'webpack'

const config: Configuration = {
    entry: {
        main: './src/client/index.tsx'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                      before: [ tsImportPluginFactory({ libraryName: 'antd', style: 'css', libraryDirectory: 'es' }) ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    devServer: {
        port: 3000,
        open: true,
        useLocalIp: true,
        historyApiFallback: true,
        proxy: {
            '/api': 'http://localhost:8080',
            '/ws': {
                target: 'ws://localhost:8080',
                ws: true
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
        new DefinePlugin({
            VERSION: JSON.stringify(process.env.npm_package_version)
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src', 'client'),
            'shared': path.resolve(__dirname, 'src', 'shared'),
        },
        extensions: ['.tsx', '.ts', '.js'],
        modules: [path.resolve(__dirname, 'public'), 'node_modules']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true
    }
}

export default config
