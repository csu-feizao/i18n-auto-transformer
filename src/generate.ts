import fs from 'fs-extra'
import nodePath from 'path'
import process from 'process'
import { ELocale } from './constant'
import { readJSONFile, writeJSONFile } from './utils/file'
import { formatCode } from './utils/code'
import { translate, upperCaseLang } from './utils/language'
import log from './utils/log'
import type { I18nOptions } from './type'

export async function generateI18n(
  i18nDir: string,
  chineseTexts: string[],
  options: I18nOptions
) {
  const localeDir = nodePath.join(i18nDir, 'locale')

  await fs.ensureDir(i18nDir)

  await generateI18nFunc(i18nDir, options)

  if (!chineseTexts.length) {
    log.success('该项目未识别到新增中文，可能是之前已经全部翻译完毕！')
    return
  }

  await fs.ensureDir(localeDir)
  const promises = options.locales.map(lang => {
    return updateI18nLocale(localeDir, lang, chineseTexts)
  })
  await Promise.all(promises)
  log.success('json 文件生成完成')
}

export async function fullfillI18nFromZH({ i18nDir, locales }: I18nOptions) {
  const localeDir = nodePath.join(process.cwd(), i18nDir, 'locale')
  const zhPath = nodePath.join(localeDir, `${ELocale.zh}.json`)
  const zhJson = readJSONFile<string>(zhPath)
  const zhList = Object.entries(zhJson)
  if (!zhList.length) {
    return
  }
  const otherLanguages = locales.filter(lang => lang !== ELocale.zh)
  const promises = otherLanguages.map(async lang => {
    return updateI18nLocale(localeDir, lang, zhList)
  })
  return Promise.all(promises)
}

async function updateI18nLocale(
  path: string,
  lang: string,
  chineseTexts: Array<string | [string, string]>
) {
  const filePath = nodePath.join(path, `${lang}.json`)
  const json = readJSONFile(filePath)
  const promises = chineseTexts.map(async item => {
    const key = typeof item === 'string' ? item : item[0]
    const text = typeof item === 'string' ? item : item[1]
    if (!Object.prototype.hasOwnProperty.call(json, key)) {
      let translatedText = text
      if (lang !== ELocale.zh) {
        translatedText = await translate(text, lang)
      }
      json[key] = translatedText
    }
  })
  await Promise.all(promises)
  writeJSONFile(filePath, json)
}

function getImportString(langs: string[]) {
  return langs
    .map(lang => {
      const locale = upperCaseLang(lang)
      return `import ${locale} from './locale/${lang}.json'`
    })
    .join('\n')
}

function getLocaleMap(langs: string[]) {
  return `const localeMap: Record<string, any> = {
${langs
  .map(lang => {
    return `  '${lang}': ${upperCaseLang(lang)}`
  })
  .join(',\n')}
}`
}

function getConfigLocaleFunc() {
  return `export function getLocale() {
    return localStorage.getItem('locale') || navigator.language || '${ELocale.zh}'
  }

  export function setLocale(locale: string) {
    localStorage.setItem('locale', locale)
  }
  `
}

function getI18nFunc() {
  return `export default function i18n(code: string) {
  const locale = getLocale()
  return localeMap[locale]?.[code] ?? code
}
`
}

async function generateI18nFunc(path: string, options: I18nOptions) {
  const { locales } = options
  const filePath = nodePath.join(path, 'index.ts')
  if (fs.existsSync(filePath)) {
    log.info('已存在 i18n 调用代码，跳过生成')
    return
  }
  const code = `${getImportString(locales)}

${getLocaleMap(locales)}

${getConfigLocaleFunc()}

${getI18nFunc()}
`
  const content = await formatCode(code, options)
  await fs.writeFile(filePath, content, {
    encoding: 'utf-8'
  })
  log.info('i18n 调用代码生成完成')
}
