import crypto from 'crypto'
import path from 'path'
import fs from 'fs-extra'
import process from 'process'
import { readJSONFile, writeJSONFile } from './file'
import log from './log'
import { I18nOptions } from '../type'

const CACHE_DIR = './.i18n_cache'
const CACHE_FILE_NAME = 'i18n.json'

let cache: Record<string, string> | null = null

export async function sameWithCache(
  filePath: string,
  option: I18nOptions
): Promise<boolean> {
  const cacheFile = getCacheFilePath(option)
  if (!fs.existsSync(cacheFile)) {
    return false
  }
  if (!cache) {
    cache = readJSONFile(cacheFile)
  }
  try {
    const hash = await calculateHash(filePath)
    return cache?.[getUnifiedPath(filePath)] === hash
  } catch (e: any) {
    log.warning('判断 hash 缓存异常，将直接解析该文件')
    return false
  }
}

export async function cacheFile(filePath: string, option: I18nOptions) {
  if (!cache) {
    cache = readJSONFile(getCacheFilePath(option))
  }
  try {
    const hash = await calculateHash(filePath)
    cache[getUnifiedPath(filePath)] = hash
  } catch (e: any) {
    log.warning('缓存文件 hash 失败')
  }
}

export function saveCache(option: I18nOptions) {
  if (!cache) {
    return
  }
  fs.ensureDirSync(getCacheDirPath(option))
  writeJSONFile(getCacheFilePath(option), cache)
  log.success('文件 hash 缓存完成')
}

/**
 * 路径作为唯一key，需要忽略操作系统符号以及项目在系统位置的不同所带来的差异
 * @param filePath
 * @returns
 */
function getUnifiedPath(filePath: string) {
  return (filePath.split(process.cwd()).pop() || '').replace(/\\/g, '/')
}

function getCacheDirPath(option: I18nOptions) {
  return path.join(process.cwd(), option.cacheDir, CACHE_DIR)
}

function getCacheFilePath(option: I18nOptions) {
  return path.join(getCacheDirPath(option), CACHE_FILE_NAME)
}

async function calculateHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const input = fs.createReadStream(filePath)

    input.on('error', reject)

    input.on('data', chunk => {
      hash.update(chunk)
    })

    input.on('end', () => {
      const fileHash = hash.digest('hex')
      resolve(fileHash)
    })
  })
}
