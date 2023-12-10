import types from '@babel/types'

export default function matchDisableRule(
  comments: Array<types.CommentBlock | types.CommentLine>
) {
  const {
    entireFileDisabled,
    partialCommentList,
    nextLineCommentList,
    thisLineCommentList
  } = collectDisableRuleCommentlocation(comments)

  return (startLine: number, endLine: number) => {
    return inDisableRuleCommentlocation(
      entireFileDisabled,
      partialCommentList,
      nextLineCommentList,
      thisLineCommentList,
      startLine,
      endLine
    )
  }
}

const collectDisableRuleCommentlocation = (
  comments: Array<types.CommentBlock | types.CommentLine>
) => {
  let entireFileDisabled = false
  const partialCommentList: Array<number[]> = []
  const nextLineCommentList: number[] = []
  const thisLineCommentList: number[] = []

  const tmp_partialCommentList: any[] = []

  if (comments.some(comment => /i18n-disable-file/.test(comment.value))) {
    entireFileDisabled = true
  } else {
    comments.forEach(comment => {
      if (/i18n-disable-next-line/.test(comment.value)) {
        nextLineCommentList.push(comment.loc!.end.line)
      } else if (/i18n-disable-line/.test(comment.value)) {
        thisLineCommentList.push(comment.loc!.start.line)
      } else if (
        /i18n-disable/.test(comment.value) &&
        comment.type === 'CommentBlock'
      ) {
        tmp_partialCommentList.push(comment.loc!.end.line)
      }
    })

    tmp_partialCommentList
      .sort((a, b) => {
        return a - b
      })
      .forEach((item, index) => {
        if (index % 2) {
          partialCommentList[partialCommentList.length - 1][1] = item
        } else {
          partialCommentList.push([item])
        }
      })
  }

  return {
    entireFileDisabled,
    partialCommentList,
    nextLineCommentList,
    thisLineCommentList
  }
}

const inDisableRuleCommentlocation = (
  entireFileDisabled: boolean,
  partialCommentList: Array<number[]>,
  nextLineCommentList: number[],
  thisLineCommentList: number[],
  startLine: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endLine: number
) => {
  // 存在文件忽略标识，整个文件忽略
  if (entireFileDisabled === true) {
    return true
  }
  // 字符串在nextLineComment下一行，则忽略
  if (nextLineCommentList.indexOf(startLine - 1) > -1) return true

  // 字符串在thislineComment同行，则忽略
  if (thisLineCommentList.indexOf(startLine) > -1) return true

  // 字符串在partialComment包裹之内，则忽略
  // 注意非闭合的情况下，则认为在此行之后直至文件结束都应该忽略
  for (let index = 0; index < partialCommentList.length; index++) {
    const pc = partialCommentList[index]
    if (pc[0] < startLine && (pc.length < 2 || pc[1] > startLine)) {
      return true
    }
  }
}
