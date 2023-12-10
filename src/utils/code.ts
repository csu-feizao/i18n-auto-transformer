import { format, Options } from 'prettier'
import path from 'path'
import fs from 'fs-extra'
import process from 'process'
import serialize from 'serialize-javascript'
import type { I18nOptions } from '../type'
import { readJSONFile } from './file'
import log from './log'

export function serializeCode(source: unknown) {
  return serialize(source, {
    unsafe: true
  })
}

export async function formatCode(code: string, i18nOptions: I18nOptions) {
  const { skip, option } = await getPrettierConfig(i18nOptions)
  if (skip) {
    return code
  }
  return format(code, option)
}

async function getPrettierConfig(i18nOptions: I18nOptions): Promise<{
  skip: boolean
  option: Options
}> {
  if (i18nOptions.prettier === false) {
    return {
      skip: true,
      option: {}
    }
  }
  if (i18nOptions.prettier) {
    return {
      skip: false,
      option: {
        parser: i18nOptions.prettierParser,
        ...i18nOptions.prettier
      }
    }
  }
  const prettierrcPath = path.join(process.cwd(), i18nOptions.prettierPath)
  if (!fs.existsSync(prettierrcPath)) {
    log.error(
      `文件 "${prettierrcPath}" 不存在。若无需代码格式化，请将 'config.prettier' 设置为 false。也可通过设置 'config.prettier' 为对象进行格式化配置。`
    )
    process.exit(1)
  }
  const option: Options = readJSONFile(prettierrcPath)
  if (!option.parser) {
    option.parser = i18nOptions.prettierParser
  }
  return {
    skip: false,
    option
  }
}
