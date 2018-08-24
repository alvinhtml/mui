const webpack = require("webpack")
const path = require('path')

module.exports = {
    entry: {
        init: ['jquery', './src/js/dlhighlight.js'],
        modal: './src/modal/modal.js',
        datepicker: './src/datepicker/datepicker.js',
        popup: './src/popup/popup.js',
        topology: ['./src/topology/topology.js', './src/topology/main.js'],
        switchs: ['./src/topology/topology.js', './src/topology/switch-main.js'],
    },
    output: {
        path: path.resolve(__dirname, 'src/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
			loader: 'style!css!autoprefixer'
        },{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'init',
            filename: 'init.min.js',
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}




/*

 */


//importLoaders=2表明你在某个less文件中import进来的资源（其它的less文件）会被使用autoprefixer和less 这两个loader解析
