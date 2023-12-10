import { Command } from '@oclif/core'
import initConfig from '../init'

export default class Init extends Command {
  static description = '初始化配置文件'

  async run(): Promise<void> {
    initConfig()
  }
}
