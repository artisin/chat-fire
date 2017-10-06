const rootPath           = 'src';
const path               = require('path');
const webpack            = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const autoprefixer       = require('autoprefixer');
const CTR                = require('ctr').stylus;
const ctr                = new CTR();

module.exports = {
  context: path.join(process.cwd(), 'src'),
  // rootPath: rootPath, // the app root folder, needed by the other webpack configs
  entry: [
    // 'webpack/hot/only-dev-server',
    'babel-polyfill',
    'react-hot-loader/patch',
    // http://gaearon.github.io/react-hot-loader/getstarted/
    'webpack-dev-server/client?http://localhost:8080',
    __dirname + '/' + rootPath + '/index.js',
  ],
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'eval-source-map',
  output: {
    path: __dirname + '/public/',
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    modules: ['node_modules']
  },
  // Make web variables accessible to webpack, e.g. window
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        // https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              root: '.',
              name: '[name].css'
            }
          }]
        })
      },  {
        test: /\.ctr(\.js|\.yml|\.yaml)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              root: '.',
              name: '[name].css'
            }
          }, {
            loader: 'ctr-loader'
          }]
        })
      }, {
        /**
         * Fonts
         */
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },  {
        /**
         * Image handler + compresses images
         */
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 1000
          }
        }, {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true
            },
            gifsicle: {
              interlaced: false
            },
            optipng: {
              optimizationLevel: 4
            },
            pngquant: {
              quality: '75-90',
              speed: 3
            }
          }
        }]
      }, {
        /**
         * Stylus, autoprefixer + ctr
         */
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              root: '.',
              name: '[name].css',
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            // @important the "last 99 versions" if for testing purposes
            options: {
              plugins: () => [autoprefixer({ browsers: ['last 4 versions'] })],
              sourceMap: true
            }
          }, {
            loader: 'stylus-loader'
          }]
        })
    }]
  },
  devServer: {
    contentBase: __dirname + '/public',
  },
  plugins: [
    new CleanWebpackPlugin(['css/main.css', 'js/bundle.js'], {
      root: __dirname + '/public',
      verbose: true,
      dry: false, // true for simulation
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [ctr]
        }
      }
    }),
    new ExtractTextPlugin({
      disable: true,
      filename: 'styles.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'REACT_APP_API_URL': "'http://localhost:3002'"
      }
    }),
  ],
};
