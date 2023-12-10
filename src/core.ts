import { glob } from 'glob'
import fs from 'fs-extra'
import nodePath from 'path'
import process from 'process'
import transform from './tranform'
import { generateI18n, fullfillI18nFromZH } from './generate'
import { cacheFile, sameWithCache, saveCache } from './utils/cache'
import type { I18nOptions } from './type'
import log from './utils/log'

export async function run(options: I18nOptions) {
  const { skipCache, ignore, codeDir, i18nDir } = options
  log.info('开始执行...')
  const codePath = nodePath.join(process.cwd(), codeDir)
  const i18nPath = nodePath.join(process.cwd(), i18nDir)
  let totalChineseTexts: string[] = []
  const globPath = `${codePath}/**/*.{js,jsx,ts,tsx}`.replace(/\\/g, '/')
  const files = await glob(globPath, { ignore })
  for (const file of files) {
    if (file.includes('node_modules') || file.includes(i18nPath)) {
      continue
    }
    if (skipCache !== false) {
      const hasCache = await sameWithCache(file, options)
      if (hasCache) {
        continue
      }
    }
    log.info(`开始解析并转换文件【${file}】...`)
    const code = fs.readFileSync(file, { encoding: 'utf-8' })
    const { code: transformedCode, chineseTexts } = await transform(
      code,
      options
    )
    if (chineseTexts.length) {
      totalChineseTexts.push(...chineseTexts)
      fs.writeFileSync(file, transformedCode, { encoding: 'utf-8' })
      log.info(
        `解析转换完成，收集到中文：${[...new Set(chineseTexts)].join(' | ')}`
      )
    } else {
      log.info('该文件未识别到新增中文')
    }
    await cacheFile(file, options)
  }

  // 去重
  totalChineseTexts = Array.from(new Set(totalChineseTexts))
  log.info('开始生成 i18n 相关文件...')
  await generateI18n(i18nPath, totalChineseTexts, options)

  saveCache(options)

  log.success('执行完毕')
}

export const translate = fullfillI18nFromZH
