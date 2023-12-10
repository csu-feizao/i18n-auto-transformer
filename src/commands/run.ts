import { Command } from '@oclif/core'
import { run } from '../core'
import { getI18nConfigs } from '../config'

export default class Run extends Command {
  static description = `核心命令，一键完成国际化提取、翻译、替换。
  开发流程：
  1. 接到新需求
  2. 使用中文开发功能
  3. 提交功能 commit
  4. 执行 i18n run 命令，会自动将所有中文提取出来，并替换成国际化函数
  5. 检查页面是否符合预期
  6. 提交国际化 commit
  7. 完成需求
  8. 回到步骤 1
  `

  async run(): Promise<void> {
    const options = getI18nConfigs()
    await run(options)
  }
}
