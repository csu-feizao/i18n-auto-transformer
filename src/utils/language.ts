import googleTranslate from '@iamtraction/google-translate'
import { ELocale } from '../constant'
import log from './log'

const INCLUDE_CHINESE_CHAR = /[\u4e00-\u9fa5]+/

export function hasChineseString(str: string): boolean {
  if (!str) {
    return false
  }
  return INCLUDE_CHINESE_CHAR.test(str)
}

export function upperCaseLang(lang: string) {
  const arr = lang.split('-')
  if (arr.length === 1) {
    return arr[0]
  }
  return arr[0] + arr[1].toUpperCase()
}

export async function translate(
  raw: string,
  to: string = ELocale.en
): Promise<string> {
  log.info(`开始翻译【${raw}】...`)
  try {
    const { text, from } = await googleTranslate(raw, {
      from: ELocale.zh,
      to
    })
    const transformedText = text ?? from.text.value ?? raw
    log.info(`翻译完成 【${raw}】=>【${transformedText}】`)
    return transformedText
  } catch (e: any) {
    log.warning(`【${raw}】翻译失败，将使用原始值，请手动翻译`)
    return raw
  }
}
