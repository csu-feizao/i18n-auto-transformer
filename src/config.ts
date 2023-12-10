import process from 'process'
import path from 'path'
import fs from 'fs-extra'
import merge from 'lodash/merge'
import { CONFIG_FILE_NAME, DETAULT_OPTIONS } from './constant'
import log from './utils/log'
import type { I18nConfigs, I18nOptions } from './type'

export function getI18nConfigs(): I18nOptions {
  const userConfig = getUserConfigs()
  return merge(DETAULT_OPTIONS, userConfig)
}

function getUserConfigs(): I18nConfigs {
  const configPath = path.join(process.cwd(), CONFIG_FILE_NAME)
  if (!fs.existsSync(configPath)) {
    log.warning('配置文件路径不存在')
    return {}
  }
  const config = require(configPath)
  return config || {}
}
