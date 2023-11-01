const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  // Customize the config before returning it.

  // postcss
  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: ['tailwindcss', 'autoprefixer'],
          },
        },
      },
    ],
  })

  // This fixes Uncaught Error: Cannot find module './global.css'
  config.resolve.alias['./global.css'] = './global.css'

  return config
}
