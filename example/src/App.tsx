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
