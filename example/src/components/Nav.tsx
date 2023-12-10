import i18n, { getLocale, setLocale } from 'i18n'
import React from 'react'

export default function Nav() {
  const toggleLocale = () => {
    const locale = getLocale() === 'zh-CN' ? 'zh-CN' : 'en'
    setLocale(locale)
    window.location.reload()
  }
  return (
    <div>
      <button onClick={toggleLocale}>{i18n('切换语言')}</button>
      <nav>
        {i18n('ss萨达$')}
        {false ? i18n('解决') : i18n('没解决')}
        {i18n('看看')}
      </nav>
    </div>
  )
}
