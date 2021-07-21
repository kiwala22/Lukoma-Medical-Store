const { environment } = require('@rails/webpacker')

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

module.exports = environment