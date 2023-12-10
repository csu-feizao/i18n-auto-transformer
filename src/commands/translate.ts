import { Command } from '@oclif/core'
import { translate } from '../core'
import { getI18nConfigs } from '../config'

export default class Translate extends Command {
  static description = `将 zhCN.json 文件中的内容增量翻译到其它国际化文件中。
  常见的使用场景：
  1. 翻译过程中部分内容翻译超时，会导致 enUS.json 等国际化文件中的值为中文，删掉这些对应的中文键值后，执行 i18n translate 能够重新翻译这些部分。
  2. 后续开发中手动在 zhCN.json 文件新增一些键值，需要同步到其它国际化文件
  `

  async run(): Promise<void> {
    const options = getI18nConfigs()
    await translate(options)
  }
}
