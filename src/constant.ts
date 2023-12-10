import type { I18nOptions } from './type'

export const CONFIG_FILE_NAME = 'i18n.config.js'

export const CONFIG_PREFIX_CODE = `
/** @type {import('i18n-auto-transformer').I18nConfigs} */
module.exports = `

export enum ELocale {
  en = 'en',
  zh = 'zh-CN'
}

export const DETAULT_OPTIONS: I18nOptions = {
  codeDir: './src',
  i18nDir: './src/i18n',
  i18nFn: 'i18n',
  i18nFrom: 'i18n',
  locales: [ELocale.zh, ELocale.en],
  cacheDir: './',
  prettierParser: 'babel-ts',
  prettierPath: './.prettierrc'
}
