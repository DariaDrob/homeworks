const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development', // Режим розробки
  entry: './src/index.js', // Одна точка входу
  output: {
    path: path.resolve(__dirname, 'dist'), // Куди виводити файли
    filename: '[name].[contenthash].js', // Хешування імен файлів
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Підтримка CSS
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/, // Робота з зображеннями
        use: 'file-loader',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/, // Підтримка шрифтів
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }), // Генерація HTML
    new CleanWebpackPlugin(), // Очищення dist
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // Оптимізація зовнішніх бібліотек (lodash)
    },
  },
};