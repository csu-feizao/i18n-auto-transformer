import path from 'path'
import process from 'process'
import fs from 'fs-extra'
import prettier from 'prettier'
import {
  CONFIG_FILE_NAME,
  CONFIG_PREFIX_CODE,
  DETAULT_OPTIONS
} from './constant'
import { serializeCode } from './utils/code'
import log from './utils/log'

export default function initConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILE_NAME)
  const code = `${CONFIG_PREFIX_CODE}${serializeCode(DETAULT_OPTIONS)}`
  fs.outputFileSync(
    configPath,
    prettier.format(code, {
      semi: false,
      singleQuote: true,
      trailingComma: 'none',
      arrowParens: 'avoid',
      endOfLine: 'auto',
      printWidth: 80,
      parser: 'babel'
    })
  )
  log.success('初始化配置文件生成完成')
}
