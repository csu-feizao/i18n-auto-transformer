import zhCN from './locale/zh-CN.json'
import en from './locale/en.json'

const localeMap: Record<string, any> = {
  'zh-CN': zhCN,
  en: en
}

export function getLocale() {
  return localStorage.getItem('locale') || navigator.language || 'zh-CN'
}

export function setLocale(locale: string) {
  localStorage.setItem('locale', locale)
}

export default function i18n(code: string) {
  const locale = getLocale()
  return localeMap[locale]?.[code] ?? code
}
