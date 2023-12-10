import { GlobOptions } from 'glob'
import type { Options as PrettierOptions } from 'prettier'

type PartialDeep<T extends object> = {
  [K in keyof T]?: T[K] extends object ? PartialDeep<T[K]> : T[K]
}

export interface I18nOptions {
  /**
   * 需要转换的文件位置，默认 `./src`
   */
  codeDir: string
  /**
   * i18n 文件存放路径，默认 `./src/i18n`
   */
  i18nDir: string
  /**
   * i18n 调用函数名，默认 `i18n`，即 `const text = i18n('示例')`
   */
  i18nFn: string
  /**
   * 引入 i18n 函数的路径，默认 `i18n`，即 `import $i18nFn$ from 'i18n'`
   */
  i18nFrom: string
  /**
   * 支持的语言列表，参考 https://cloud.google.com/translate/docs/languages，默认 `['zh-CN', 'en']`
   */
  locales: string[]
  /**
   * 排除某些文件或文件夹的翻译，参考 `glob` 的 `ignore` 配置
   */
  ignore?: GlobOptions['ignore']
  /**
   * 跳过缓存，重新遍历所有文件
   */
  skipCache?: boolean
  /**
   * 缓存文件的位置，默认 `./`
   */
  cacheDir: string
  /**
   * `prettier` 解析器，默认 `babel-ts`
   */
  prettierParser: PrettierOptions['parser']
  /**
   * `prettier` 路径，默认 `./.prettierrc`
   */
  prettierPath: string
  /**
   * `prettier` 配置对象，优先级高于 `prettierPath`，为 `false` 时则不进行格式化
   */
  prettier?: Omit<PrettierOptions, 'parser'> | false
}

export type I18nConfigs = PartialDeep<I18nOptions>
