# i18n-auto-transformer

一款能够让你的中文项目一键完成 i18n 国际化功能改造的命令行工具，支持多次增量提取、缓存、语言包补全。执行一次命令即可让任意 App 支持国际化，丝滑开发。

## 功能

- [x] 支持 `js`, `ts`, `react` 项目
- [x] 自动将代码中的中文替换为 `i18n` 调用函数，并将提取到的中文存入 `zh-CN.json` 语言包中
- [x] 自动生成 `i18n` 调用函数的默认实现
- [x] 自动将中文语言包通过谷歌翻译自动翻译生成其他任意语言包
- [x] 支持自定义 `i18n` 的调用方法名、导入路径、语言包的存放位置
- [x] 支持修改 `i18n` 调用函数的实现，方便结合第三方国际化方案
- [x] 自动忽略 `console.log` 中的中文
- [x] 支持通过 `i18n-disable-file` `i18n-disable` `i18n-disable-line` `i18n-disable-next-line` 等多种注释，跳过中文提取
- [x] 支持通过 `glob` 语法配置忽略部分文件、文件夹的中文提取
- [x] 支持 `prettier` 格式化代码
- [x] 支持多次执行提取方法，增量提取
- [x] 支持缓存，通过文件 hash 自动跳过提取
- [x] 支持通过中文语言包对其它语言包补全
- [x] 支持自定义语言包 `key` 值

## 安装

```
npm i -D i18n-auto-transformer
```

## 使用步骤

1. 执行 `npx i18n run`，本工具将自动完成提取中文、翻译语言、生成 `i18n` 函数、生成语言 `JSON` 文件、将代码中的中文替换为 `i18n` 函数调用等全部任务

2. 检查翻译后的 `JSON` 文件，校验翻译准确性、调整大小写、空格，检查生成的代码正确性

3. 提交修改，完成项目国际化

## 命令介绍

**`i18n run`**

核心命令，一键完成国际化提取、翻译、替换。

开发流程：
1. 接到新需求
2. 使用中文开发功能
3. 提交功能 commit
4. 执行 `i18n run` 命令，会自动将所有中文提取出来，并替换成国际化函数
5. 检查页面是否符合预期
6. 提交国际化 commit
7. 完成需求
8. 回到步骤 1

**`i18n translate`**

将 `zhCN.json` 语言包文件中的内容增量翻译到其它语言包中。
常见的使用场景：

1. 翻译过程中部分内容翻译超时，会导致 `en.json` 等国际化文件中的值为中文，删掉这些对应的中文键值后，执行 `i18n translate` 能够重新翻译这些部分。
2. 后续开发中手动在 `zhCN.json` 文件添加了一些键值，需要同步到其它语言包中

**`i18n init`**

生成初始化自定义配置文件 `i18n.config.js`，支持各种自定义配置

**`i18n help`**
帮助命令，可以在界面中显示各个命令的解释，例如

```bash
$ npx i18n help
一款能够让你的中文项目一键完成 i18n 国际化功能改造的命令行工具，支持多次增量提取、缓存、英文补全，丝滑开发。

VERSION
  i18n-auto-transformer/0.0.0 win32-x64 node-v14.19.3

USAGE
  $ i18n [COMMAND]

TOPICS
  plugins  List installed plugins.

COMMANDS
  help       Display help for i18n.
  init       初始化配置文件
  plugins    List installed plugins.
  run        核心命令，一键完成国际化提取、翻译、替换。
  translate  将 zhCN.json 文件中的内容增量翻译到其它国际化文件中。

```

```bash
$ npx i18n help run
核心命令，一键完成国际化提取、翻译、替换。

USAGE
  $ i18n run

DESCRIPTION
  核心命令，一键完成国际化提取、翻译、替换。

  开发流程：

  1. 接到新需求

  2. 使用中文开发功能

  3. 提交功能 commit

  4. 执行 i18n run 命令，会自动将所有中文提取出来，并替换成国际化函数

  5. 检查页面是否符合预期

  6. 提交国际化 commit

  7. 完成需求

  8. 回到步骤 1
```

## 配置项

```ts
interface I18nConfigs {
  /**
   * 需要转换的文件位置，默认 `./src`
   */
  codeDir?: string
  /**
   * i18n 文件存放路径，默认 `./src/i18n`
   */
  i18nDir?: string
  /**
   * i18n 调用函数名，默认 `i18n`，即 `const text = i18n('示例')`
   */
  i18nFn?: string
  /**
   * 引入 i18n 函数的路径，默认 `i18n`，即 `import $i18nFn$ from 'i18n'`
   */
  i18nFrom?: string
  /**
   * 支持的语言列表，参考 https://cloud.google.com/translate/docs/languages，默认 `['zh-CN', 'en']`
   */
  locales?: string[]
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
  cacheDir?: string
  /**
   * `prettier` 解析器，默认 `babel-ts`
   */
  prettierParser?: PrettierOptions['parser']
  /**
   * `prettier` 路径，默认 `./.prettierrc`
   */
  prettierPath?: string
  /**
   * `prettier` 配置对象，优先级高于 `prettierPath`，为 `false` 时则不进行格式化
   */
  prettier?: Omit<PrettierOptions, 'parser'> | false
}
```

## 效果示例

转换前

```jsx
import React, { useReducer } from 'react'

// i18n-disable-next-line
const ignored = '忽略提取的中文'

export default function Example() {
  const [time, addTime] = useReducer((a: number) => a + 1, 0)

  return (
    <div>
      <button onClick={addTime}>按钮</button>
      <p title="点击次数">{`已点击 ${time} 次`}</p>
    </div>
  )
}
```

转换后

```jsx
import i18n from 'i18n'
import React, { useReducer } from 'react'

// i18n-disable-next-line
const ignored = '忽略提取的中文'

export default function Example() {
  const [time, addTime] = useReducer((a: number) => a + 1, 0)

  return (
    <div>
      <button onClick={addTime}>{i18n('按钮')}</button>
      <p title={i18n('点击次数')}>{`${i18n('已点击 ')}${time}${i18n(
        ' 次'
      )}`}</p>
    </div>
  )
}
```

## 常见问题

1. 翻译超时，生成的语言包里依然是中文字符


本工具使用了 Google 翻译，因此需要先保证**能够使用外网**。若是 `Clash for Windows`，可以开启 `TUN Mode` 实现全局代理

路径：`General` - `Service Mode` - `Manage` 安装插件, 安装完成后打开 `TUN mode` 开关

若是部分翻译超时，可以删除语言包中翻译失败的部分，或者直接删除语言包文件，执行 `i18n translate` 命令，便能基于中文 `zhCN.json` 文件进行重新翻译生成

2. 如何忽略翻译代码中的部分中文

支持通过注释来忽略，跟 `eslint-ignore` 类似

- `// i18n-disable-file` 将忽略整个文件的中文翻译

```js
// i18n-disable-file

export const a = '啊啊'

export const b = '问问'
```

- `// i18n-disable-next-line` 将忽略下一行的中文

```js
// i18n-disable-next-line
export const c = '萨达是'
```

- `// i18n-disable-line` 将忽略本行的中文

```js
export const d = '啥第四十' // i18n-disable-line
```

- `/* i18n-disable */` 将忽略两个注释中间的所有中文，若只有一个注释，则会忽略当前行直至文件结束的所有中文

```js
/* i18n-disable */
export const e = '爱仕达'
export const f = '撒旦'
/* i18n-disable */
```
