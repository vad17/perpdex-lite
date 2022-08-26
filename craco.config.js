const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    webpack: {
        configure: (config, { env, paths }) => {
            config.plugins
                .find(plugin => Object.getPrototypeOf(plugin).constructor.name === 'HtmlWebpackPlugin')
                .options.inlineSource = '.(js|css)$'
            config.plugins.push(new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin))
            return config;
        }
    },
}
