import { transformFromAstSync, traverse, types } from '@babel/core'
import * as babelParser from '@babel/parser'
import { addDefault } from '@babel/helper-module-imports'
import { generateI18nCall } from './utils/ast'
import { hasChineseString } from './utils/language'
import log from './utils/log'
import { formatCode } from './utils/code'
import matchDisableRule from './disableRule'
import type { I18nOptions } from './type'

export default async function transform(
  code: string,
  options: I18nOptions
): Promise<{
  code: string
  chineseTexts: string[]
}> {
  const { i18nFn, i18nFrom } = options
  const chineseTexts: string[] = []
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'decorators']
  })

  const isInDisableRule = matchDisableRule(ast.comments ?? [])

  traverse(ast, {
    Program: {
      enter(path) {
        path.traverse({
          'StringLiteral|TemplateLiteral|JSXText'(path) {
            // 在console.log内的文字不处理
            const isInConsoleLog = path.findParent(p => {
              return (
                p.isCallExpression() &&
                types.isMemberExpression(p.node.callee) &&
                types.isIdentifier(p.node.callee.object, { name: 'console' })
              )
            })
            const startLine = path.node.loc?.start.line
            const endLine = path.node.loc?.end.line
            if (
              isInConsoleLog ||
              (startLine && endLine && isInDisableRule(startLine, endLine))
            ) {
              ;(path.node as any).skipTransform = true
            }
          }
        })
      }
    },
    StringLiteral(path) {
      if ((path.node as any).skipTransform) {
        return
      }
      const value = path.node.value

      // 已经处理过的 i18n('xxx') 要忽略掉，避免死循环
      let isInI18nCall = false
      if (path.parentPath?.isCallExpression()) {
        const callee = path.parentPath?.get('callee')
        isInI18nCall = callee.isIdentifier() && callee.node.name === i18nFn
      }
      if (hasChineseString(value) && !isInI18nCall) {
        chineseTexts.push(value)
        const i18nCall = generateI18nCall(value, i18nFn)
        if (path.parentPath.type === 'JSXAttribute') {
          path.replaceWith(types.jSXExpressionContainer(i18nCall))
        } else {
          path.replaceWith(i18nCall)
        }
      }
    },
    TemplateLiteral(path) {
      if ((path.node as any).skipTransform) {
        return
      }
      const { node } = path
      const newQuasis: types.TemplateElement[] = []
      const newExpressions: Array<types.Expression | types.TSType> = []
      node.quasis.forEach((quasis, index) => {
        const value = quasis.value.raw
        if (hasChineseString(value)) {
          chineseTexts.push(value)
          const i18nCall = generateI18nCall(value, i18nFn)
          newQuasis.push(types.templateElement({ raw: '', cooked: '' }))
          newQuasis.push(types.templateElement({ raw: '', cooked: '' }))

          if (index !== node.quasis.length - 1) {
            newExpressions.push(i18nCall, node.expressions[index])
          } else {
            newExpressions.push(i18nCall)
          }
        } else {
          newQuasis.push(quasis)
          if (index !== node.quasis.length - 1) {
            newExpressions.push(node.expressions[index])
          }
        }
      })
      if (newQuasis.length !== newExpressions.length + 1) {
        log.error(
          `模板字符串处理错误，[${newQuasis.map(q => q.value.raw).join(', ')}],
          [${newExpressions.join(', ')}]`
        )
      }
      path.replaceWith(types.templateLiteral(newQuasis, newExpressions))
      ;(path.node as any).skipTransform = true
    },
    JSXText(path) {
      if ((path.node as any).skipTransform) {
        return
      }
      const value = path.node.value.trim()
      if (hasChineseString(value)) {
        chineseTexts.push(value)
        path.replaceWith(
          types.jsxExpressionContainer(generateI18nCall(value, i18nFn))
        )
      }
    }
  })

  if (chineseTexts.length) {
    let hasI18nImport = false
    traverse(ast, {
      Program(path) {
        path.get('body').forEach(childPath => {
          if (childPath.isImportDeclaration()) {
            const matchI18nDefaultImport = childPath.node.specifiers.some(
              specifier =>
                specifier.type === 'ImportDefaultSpecifier' &&
                specifier.local.name === i18nFn
            )
            const matchImportFrom = childPath.node.source.value === i18nFrom
            if (matchI18nDefaultImport && matchImportFrom) {
              hasI18nImport = true
            }
          }
        })
        if (!hasI18nImport) {
          // 如果文件中含有中文，则自动引入 i18n 函数
          addDefault(path, i18nFrom, {
            nameHint: i18nFn
          })
        }
      },
      ImportDefaultSpecifier(path) {
        const importName = path.node.local.name
        // addDefault 添加的内容会加入 _ 前缀，因此需要手动去掉这个前缀
        if (importName === `_${i18nFn}`) {
          const newSpecifier = types.importDefaultSpecifier(
            types.identifier(i18nFn)
          )
          path.replaceWith(newSpecifier)
        }
      }
    })
  }

  const transformedCode =
    transformFromAstSync(ast, undefined, {
      generatorOpts: {
        jsescOption: {
          minimal: true
        },
        retainLines: true
      }
    })?.code ?? ''

  const formatedCode = await formatCode(transformedCode, options)
  return {
    code: formatedCode,
    chineseTexts
  }
}
