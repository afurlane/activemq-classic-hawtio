const pluginId = process.env.PLUGIN_ID;
const pluginScope = process.env.PLUGIN_SCOPE;
const pluginModule = process.env.PLUGIN_MODULE;

const { ModuleFederationPlugin } = require('webpack').container
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: 'auto',
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript' },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: pluginScope,
      filename: 'remoteEntry.js',
      exposes: {
         [`./${pluginModule}`]: './src/index',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@hawtio/react': { singleton: true },
      },
    }),
  ],
}
