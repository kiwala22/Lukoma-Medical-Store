const { environment } = require('@rails/webpacker')
const jquery = require('./plugins/jquery')

const less_loader = {
    test: /\.less$/,
    use: [
        {
            loader: 'style-loader',
          },
        {
            loader: 'css-loader'
        },
        {
            loader: "less-loader",
            options: {
                javascriptEnabled: true
            }
        }
    ]
};
environment.loaders.append('less', less_loader)

environment.plugins.prepend('jquery', jquery)
module.exports = environment