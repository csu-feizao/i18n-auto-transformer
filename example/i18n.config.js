/** @type {import('i18n-auto-transformer').I18nConfigs} */
module.exports = {
  codeDir: './src',
  i18nDir: './src/i18n',
  i18nFn: 'i18n',
  i18nFrom: 'i18n',
  locales: ['zh-CN', 'en'],
  cacheDir: './',
  prettierParser: 'babel-ts',
  prettierPath: '../.prettierrc',
  ignore: ['src/should-ignore/*']
}
