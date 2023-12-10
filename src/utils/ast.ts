import { traverse, NodePath, types } from '@babel/core'

export function isReactFuncComponent(path: NodePath): boolean {
  const { node } = path
  if (!types.isFunctionDeclaration(node)) {
    return false
  }
  let hasJSXReturn = false
  traverse(node, {
    ReturnStatement(returnPath) {
      if (types.isJSXElement(returnPath.node.argument)) {
        hasJSXReturn = true
        returnPath.stop()
      }
    }
  })
  return hasJSXReturn
}

export function generateI18nCall(text: string, funcName: string) {
  return types.callExpression(types.identifier(funcName), [
    types.stringLiteral(text)
  ])
}
